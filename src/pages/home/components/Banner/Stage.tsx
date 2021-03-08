import React, { useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';
import classnames from 'classnames';
import { contextEasterEgg } from '@/context';
import { ReactComponent as O2Ring } from '@/static/o2-ring.svg';
import { ReactComponent as O2Text } from '@/static/o2text.svg';
import { ReactComponent as O2TextRect } from '@/static/o2text-rect.svg';
import styles from './Stage.module.scss';

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CylinderGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  Texture,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
// import * as THREE from 'three';

interface Props {
  className?: string;
  isActive3D?: boolean;
  setPromise3DEnd?: (promise: Promise<() => void> | undefined) => void;
}

async function getTextureFromSvg(
  svg: SVGSVGElement,
): Promise<[texture: Texture, width: number, height: number]> {
  const svgSize = svg.getBoundingClientRect();
  const width = svgSize.width;
  const height = svgSize.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.background = 'transparent';
  const ctx = canvas.getContext('2d');
  ctx && (ctx.fillStyle = 'rgba(255, 255, 255, 0)');

  const svgData = new XMLSerializer().serializeToString(svg);
  const img = document.createElement('img');
  img.setAttribute(
    'src',
    'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgData))),
  );

  const texture: Texture = await new Promise((res) => {
    img.onload = function () {
      ctx?.drawImage(img, 0, 0);

      const texture = new Texture(canvas);
      texture.needsUpdate = true;

      res(texture);
    };
  });

  return [texture, width, height];
}

function render3D(
  element: HTMLDivElement,
  texture: Texture,
  textureRect: Texture,
  width: number,
  height: number,
): () => void {
  const radius = width / 2 / Math.PI;
  const cameraFar = radius * 9;

  let renderer = new WebGLRenderer({ alpha: true, logarithmicDepthBuffer: true });
  let camera = new PerspectiveCamera(
    10,
    element.offsetWidth / element.offsetHeight,
    cameraFar - radius * 1 - 10,
    cameraFar + radius * 1 + 10,
  );
  let scene = new Scene();
  let controls = new OrbitControls(camera, renderer.domElement);
  let cylinder: Mesh, cylinderRect: Mesh;
  let geometry: CylinderGeometry;
  let material: MeshBasicMaterial, materialRect: MeshBasicMaterial;

  let resizeObserver = new ResizeObserver(
    throttle(() => {
      camera.aspect = element.offsetWidth / element.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(element.offsetWidth, element.offsetHeight);
    }, 1 * 1000),
  );

  // const axesHelper = new THREE.AxesHelper(100000);
  // scene.add(axesHelper);

  init();
  animate();

  async function init() {
    scene.rotateX((Math.PI * 1) / 5);

    // camera.position.set(0, 0, cameraFar);
    // (window as any).getCameraPosition = () => [camera.position.x / radius, camera.position.y / radius, camera.position.z / radius];

    // 调整 controls 并通过 getCameraPosition() 获取的位置，可以使用位置 (0, 0, cameraFar) 不会超出视锥体
    const initialPostion = [-1.5246257683227094, 2.094979130211673, 8.618964417942443];
    camera.position.set(
      initialPostion[0] * radius,
      initialPostion[1] * radius,
      initialPostion[2] * radius,
    );
    camera.lookAt(0, 0, 0);

    geometry = new CylinderGeometry(radius * 0.99, radius, height, width, height, true);

    material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
    });
    cylinder = new Mesh(geometry, material);
    cylinder.renderOrder = 2;

    materialRect = new MeshBasicMaterial({
      map: textureRect,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
    });
    cylinderRect = new Mesh(geometry, materialRect);
    cylinderRect.renderOrder = 1;

    scene.add(camera);
    scene.add(cylinder);
    scene.add(cylinderRect);

    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.offsetWidth, element.offsetHeight);

    controls.enableDamping = true;
    controls.enablePan = true;
    controls.enableZoom = false;
    // controls.autoRotate = true;

    resizeObserver.observe(element);

    element.appendChild(renderer.domElement);
  }

  function animate() {
    if (!renderer) return;

    requestAnimationFrame(animate);

    cylinder.rotation.y += 0.002;
    cylinder.rotation.y %= 2 * Math.PI;
    cylinderRect.rotation.y += 0.002;
    cylinderRect.rotation.y %= 2 * Math.PI;

    controls.update();
    renderer.render(scene, camera);
  }

  return function destroy() {
    materialRect.dispose();
    material.dispose();
    geometry.dispose();
    controls.dispose();
    renderer.dispose();

    (renderer as unknown) = null;
    (camera as unknown) = null;
    (scene as unknown) = null;
    (controls as unknown) = null;
    (cylinder as unknown) = null;
    (cylinderRect as unknown) = null;
    (geometry as unknown) = null;
    (material as unknown) = null;
    (materialRect as unknown) = null;

    resizeObserver.disconnect();
    (resizeObserver as unknown) = null;
  };
}

const Stage3D: React.FC<Props> = (props) => {
  const { className, setPromise3DEnd } = props;
  const ref = useRef<HTMLDivElement>(null);
  const refSvg = useRef<SVGSVGElement>(null);
  const refSvgRect = useRef<SVGSVGElement>(null);

  // 需要给 svg 元素设定宽高，避免 firefox 下渲染不出来；
  // https://stackoverflow.com/questions/28690643/firefox-error-rendering-an-svg-image-to-html5-canvas-with-drawimage
  // https://bugzilla.mozilla.org/show_bug.cgi?id=700533
  const originWidth = 2386.92; // from svg viewBox
  const originHeight = 87.18; // from svg viewBox
  const definition = 4; // 清晰度，体现为 svg width，越大越清晰，性能要求越高

  const [textWidth, setTextWidth] = useState<number>(originWidth * definition);
  const [textHeight, setTextHeight] = useState<number>(originHeight * definition);

  useEffect(() => {
    const width = Math.min(window.screen.width, originWidth);
    setTextWidth(width * definition);
    setTextHeight(((width * originHeight) / originWidth) * definition);
  }, [originWidth, originHeight, definition]);

  useEffect(() => {
    const element = ref.current;
    let promiseDestroy: Promise<() => void>;

    if (element && refSvg.current && refSvgRect.current) {
      promiseDestroy = Promise.all([
        getTextureFromSvg(refSvg.current),
        getTextureFromSvg(refSvgRect.current),
      ]).then(([[texture, width, height], [textureRect]]) => {
        return render3D(element, texture, textureRect, width, height);
      });

      setPromise3DEnd?.(promiseDestroy);
    }

    return () => {
      (async () => {
        setPromise3DEnd?.(undefined);

        const destroy = await promiseDestroy;
        destroy?.();

        if (element) element.innerHTML = '';
      })();
    };
  }, [ref, refSvg, refSvgRect, setPromise3DEnd]);

  return (
    <div className={classnames(className, styles.stage)}>
      <div className={styles.three} ref={ref}></div>
      <O2Text className={styles.origin} ref={refSvg} width={textWidth} height={textHeight} />
      <O2TextRect
        className={styles.origin}
        ref={refSvgRect}
        width={textWidth}
        height={textHeight}
      />
    </div>
  );
};

const Fallback: React.FC<Props> = (props) => {
  const { className } = props;

  return (
    <div className={classnames(className, styles.fallback)}>
      <O2Ring />
    </div>
  );
};

const Index: React.FC<Props> = (props) => {
  const { className } = props;

  // canPlay3D 判断是否能渲染 three.js 生成的 3D 组件，不能则返回 Fallback；
  // isActive3D 控制 3D 的切换动画；
  // 生成 3D 需要一段时间，传递的 promise3DEnd 实际上是在等待同步的 render3D()，其返回的是一个 destroy function，有返回即可不影响判断；
  // shouldRender3D 控制是否要渲染 3D 组件，销毁它可以节省内存；会在切换动画之后销毁；
  // 通过彩蛋控制是否要切换为 3D 组件；（同样受 canPlay3D 限制）
  const [canPlay3D, setCanPlay3D] = useState<boolean>(false);
  const [isActive3D, setIsActive3D] = useState<boolean>(false);
  const [promise3DEnd, setPromise3DEnd] = useState<Promise<() => void> | undefined>();
  const [shouldRender3D, setShouldRender3D] = useState<boolean>(false);
  const easterEgg = useContext(contextEasterEgg);

  useEffect(() => {
    // const width = document.body.clientWidth;
    // const height = document.body.clientHeight;

    // 只在初始化做判断，不考虑 resize；
    // 需要浏览器支持 webgl；
    // width < 1200 认为是移动端，性能太低过滤；
    // width / height >= 1.35 是因为如果宽高比不够，初始状态水平方向会被裁剪；
    // setCanPlay3D(WEBGL.isWebGLAvailable() && width >= 1200 && width / height >= 1.35);

    // 因为是通过彩蛋控制，判断浏览器支持 webgl 即可；
    // 性能低的移动端不方便打开控制台，不方便打开彩蛋，因此不做限制；
    setCanPlay3D(WEBGL.isWebGLAvailable());
  }, []);

  useEffect(() => {
    (async () => {
      const isPlay = !!easterEgg.play;

      if (isPlay) {
        setShouldRender3D(true);
        const is3DEnd = await promise3DEnd;
        if (is3DEnd) setIsActive3D(true);
      } else {
        setIsActive3D(false);

        // 销毁 3D 组件节省内存，延迟是要等做完动画
        setTimeout(() => {
          setShouldRender3D(false);
        }, 2 * 1000);
      }
    })();
  }, [promise3DEnd, easterEgg]);

  const fallback = (
    <Fallback
      {...props}
      className={classnames(className, !(canPlay3D && isActive3D) ? styles.active : '')}
    />
  );

  if (!canPlay3D) return fallback;

  const stage = (
    <Stage3D
      {...props}
      className={classnames(className, isActive3D ? styles.active : '')}
      setPromise3DEnd={setPromise3DEnd}
    />
  );

  return (
    <>
      {shouldRender3D && stage}
      {fallback}
    </>
  );
};

export default Index;
