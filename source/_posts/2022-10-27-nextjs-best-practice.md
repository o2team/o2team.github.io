title: 一文了解 NextJS 并对性能优化做出最佳实践  
subtitle: 从`是什么`，`为什么`，`怎么做`来为大家阐述 NextJS 以及如何优化 NextJS 应用体验。  
cover: https://img12.360buyimg.com/img/s1800x1096_jfs/t1/148662/13/30826/72158/6359f477E3e4a45c5/b775a7bebd4bafdb.png  
category: 经验分享
tags: 
  - Nextjs
  - 性能优化
  - 最佳实践  
author:   
  nick: 阿文  
  github_name: AwesomeDevin  
date: 2022-10-27 21:00:00  
wechat:  
    share_cover: https://img12.360buyimg.com/img/s1800x1096_jfs/t1/148662/13/30826/72158/6359f477E3e4a45c5/b775a7bebd4bafdb.png  
    share_title: 一文了解 NextJS 并对性能优化做出最佳实践  
    share_desc:  从`是什么`，`为什么`，`怎么做`来为大家阐述 NextJS 以及如何优化 NextJS 应用体验。  
---

## 引言
从本文中，我将从`是什么`，`为什么`，`怎么做`来为大家阐述 NextJS 以及如何优化 NextJS 应用体验。
## 一、NextJS是什么
`NextJS`是一款基于 React 进行 web 应用开发的框架，它以极快的应用体验而闻名，内置 Sass、Less、ES 等特性，开箱即用。SSR 只是 NextJS 的一种场景而已，它拥有`4种渲染模式`，我们需要为自己的应用选择正确的渲染模式：
- **Client Side Rendering (CSR)**   
  客户端渲染，往往是一个 SPA(单页面应用)，HTML文件仅包含JS\CSS资源，不涉及页面内容，页面内容需要浏览器解析JS后二次渲染。
- **Static Site Generation (SSG)**  
  静态页面生成，对于不需要频繁更新的静态页面内容，适合SSR，不依赖服务端。
- **Server Side Rendering (SSR)**  
  服务端渲染，对于需要频繁更新的静态页面内容，更适合使用SSR，依赖服务端。
- **IncreIncremental Site Rendering (ISR)**  
  增量静态生成，基于页面内容的缓存机制，仅对未缓存过的静态页面进行生成，依赖服务端。 
  
  
SSG / ISR 都是非常适合博客类应用的，区别在于`SSG是构建时生成，效率较低，ISR是基于已有的缓存按需生成，效率更高`。


![image.png](https://img12.360buyimg.com/img/s2316x746_jfs/t1/60416/40/22041/347990/635a0abdEecd27646/84991e55d655e4a1.png)


## 二、为什么选 NextJS
### 优点:
1. **首屏加载速度快**  
    我们的内嵌场景比较丰富，因此比较`追求页面的一个首屏体验`，NextJS 的产物类似 `MPA（多页面应用）`，在请求页面时会对当前页面的资源进行`按需加载`,而不是去加载整个应用, 相对于 SPA 而言，可以实现更为极致的用户体验。
2. **SEO优化好**  
    SSR \ SSG \ ISR 支持`页面内容预加载`，提升了搜索引擎的友好性。
    
3. **内置特性易用且极致**  
    NextJS 内置 `getStaticProps`、`getServerSideProps`、`next/image`、`next/link`、`next/script`等特性，充分利用该框架的这些特性，为你的用户提供更高层次的体验，这些内容后文会细讲。

### 缺点：
1. **页面响应相对于SPA而言更慢**  
    由于页面资源分页面按需加载，每次路由发生变化都需要加载新的资源，优化不够好的话，会导致`页面卡顿`。
2. **开发体验不够友好**  
    开发环境下 NextJS 根据当前页面按需进行资源实时构建，影响开发及调试体验
    
## 三、如何将 NextJS 应用体验提升到极致
作为一名开发者，我们追求的不应该是应用能用就好，而是好用，那么如何评价我们的应用是否好用呢？  
- 最直接的方案当然是通过收集用户反馈来评判
- 从开发层面，最直观的就是通过`performance`与`lighthouse`来评判
### 3.1 优化前
>如你所见，由于应用模块的一个复杂性，我们的 NextJS 应用起初性能并不是很好，甚至谈得上是差
- FCP: 首次内容绘制时间1.8s  

    ![image.png](https://img12.360buyimg.com/img/s767x265_jfs/t1/123109/25/30441/31233/635a0b27Ed09a3a61/72e64e765b92c082.png)


- lighthouse: 性能评分报告 55分，Time to Interactive(TTI) 可交互时间为 7.3s，通常是发生在页面依赖的资源已经加载完成。  

    ![](https://img12.360buyimg.com/img/s784x533_jfs/t1/34307/32/18940/45363/635a0b47Ee421273d/d6b38b0ff1feb538.png)

- network: 我们每次进行路由跳转都要按需加载资源，因此我们需要单个页面的 DomContentLoaded 尽可能快以保证页面 Dom 结构的渲染效率。

    ![image.png](https://img12.360buyimg.com/img/s1397x50_jfs/t1/146528/14/32340/26597/635a1adcEe5671f04/4ee4cf40ba1b720c.png)

- 页面构建时间

    ![image.png](https://img12.360buyimg.com/img/s754x284_jfs/t1/101480/17/34324/94579/635a1b57E31984e57/bfc7eb30cd6bd34d.png)
> 这些指标都间接反馈出应用的体验问题亟待解决。

![image.png](https://img12.360buyimg.com/img/s300x300_jfs/t1/84460/12/21122/17690/635a1b80Ea68ff688/1119848293b3bee2.jpg)

### 3.2 优化措施
- 优化用户体验  
    - **1. 开启 gzip 压缩**  
    通过 network 可以看到资源实际大小及 http 请求的 size，如果不开启压缩，二者基本是没有差异的。
    ![image.png](https://img12.360buyimg.com/img/s1540x247_jfs/t1/85602/26/33860/99692/635a1ca3Ebdb4b039/203e11113afbf058.png)
    gzip 优化后可以看到, 压缩效果还是很明显的

    开启 nginx 的 gzip 压缩
        ```shell
        gzip                            on;
        gzip_min_length                 100;
        gzip_buffers                    4 16k;
        # gzip_http_version               1.0;
        gzip_comp_level                 9;
        gzip_types                      gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/javascript;
        gzip_vary                       on;
        gzip_proxied                       any;
        ```
     
         通过 response header 判断压缩是否生效  
        ![image.png](https://img12.360buyimg.com/img/s356x278_jfs/t1/123411/6/32476/40551/635a1e58E1bef9e2f/8e931332a588fc1e.png)  
    - **2. 针对非首屏组件基于 dynamic 动态加载**  
        在页面加载过程中，针对一些不可见组件，我们应该动态导入，而不是正常导入，`确保只有需要该组件的场景下，才 fetch 对应资源`, 通过 `next/dynamic`，在构建时，框架层面会帮我们进行分包
        ```javascript
        import dynamic from 'next/dynamic'
        const Modal = dynamic(() => import('../components/mModal'));
        export default function Index() {
          return (
            {showModal && <Modal />}
          )
        }
        ```
        打开Network。当条件满足时，你将看到一个新的网络请求被发出来获取动态组件(单击按钮打开一个模态)。
    - **3 . next/script 优化 script 加载时**  
    `next/script` 可以帮助我们来`决定 js 脚本加载的时机`  
    
        strategy | 描述
        ---- | ---
        beforeInteractive | 可交互前加载脚本
        afterInteractive | 可交互后加载脚本
        lazyOnload | 浏览器空闲时加载脚本
    
        ```html
        <Script strategy="lazyOnload" src="//wl.jd.com/boomerang.min.js" />
        ```
    - **4. next/image 优化图片资源**  
        `next/image` 可帮助我们`对图片进行压缩（尺寸 or 质量），且支持图片懒加载`，默认 loader 依赖 nextjs 内置服务，也可以通过`{loader: custom}`自定义loader
        ```js
        import Image from 'next/image'
        const myLoader = ({ src, width, quality }) => {
          return `https://example.com/${src}?w=${width}&q=${quality || 75}`
        }
        const MyImage = (props) => {
          return (
            <Image
              loader={myLoader}
              src="me.png"
              alt="Picture of the author"
              width={500}
              height={500}
            />
          )
        }
        ```
    - **5. next/link 预加载**  
        基于 `hover 识别用户意图`，当用户 hover 到 Link 标签时，`对即将跳转的页面资源进行预加载`，进一步防止页面卡顿
        ```js
        import Link from 'next/link'
        <Link prefetch={false} href={href}>目标页面</Link>
        ```
    - **6. 静态内容预加载**  
        基于 `getStaticProps` 对不需要权限的内容进行预加载，它将在 NextJS 构建时被编译到页面中，`减少了 http 请求数量`
        ```js
        function Blog({ posts }) {
          return (
            <ul>
              {posts.map((post) => (
                <li>{post.title}</li>
              ))}
            </ul>
          )
        }
        export async function getStaticProps() {
          const res = await fetch('https://.../posts')
          const posts = await res.json()

          return {
            props: {
              posts,
            },
          }
        }
        export default Blog
        ```
    - **7. 第三方 library 过大时，基于 umd 按需加载**  
    当`第三方 library 过大时，以 umd 进行引入`，在需要的场景下通过 script 进行加载。
        ```js
        // 封装记载umd模块的hoc
        function loadUmdHoc(Comp: (props) => JSX.Element, src: string) {
          return function Hoc(props) {
            const [isLoaded, setLoaded] = useState(
              !!Array.from(document.body.getElementsByTagName('script')).filter(
                (item) => item.src.match(src)
              ).length
            )
            useEffect(() => {
              if (isLoaded) return
              const script = document.createElement('script')
              script.src = src
              script.onload = () => {
                setLoaded(true)
              }
              document.body.append(script)
            }, [])

            if (isLoaded) {
              return <Comp {...props} />
            }
            return <></>
          }
        }
        
        function Upload(){
          // todo 使用umd模块
          return <></>
        }
        
        // 使用该组件时，加载hoc
        export default loadUmdHoc(
          Upload,
          'xxx.umd.js'
        )
        ```

- 优化研发体验  
    - **1. 基于 urlimport 进行瘦身，提升编译效率**  
        `urlImport` 是 NextJS 提供的一个实验特性，支持加载远程 esmodule
    ![image.png](https://img12.360buyimg.com/img/s1934x676_jfs/t1/148644/39/30658/95984/635a1e8fE78aa70e7/2819da533964e8ef.png)  
NextJS 会在本地对所加载的远程模块进行缓存, 减少了我们所需构建的模块数，缺点是它会`影响 treeShaking` 的一个效果，因此在生产环境，建议通过`NormalModuleReplacementPlugin`对 urlimport 的依赖进行一个本地替换
    ![image.png](https://img12.360buyimg.com/img/s1620x1160_jfs/t1/179580/36/27661/238863/635a1ec7Eb5e75dab/23008470562d4038.png)
    
    - **2. webpack 配置选择性忽略**  
      针对一些生成环境的配置我们可以`通过区分环境来进行选择性忽略部分配置`，如 module federation exposes 在开发环境我们就可以忽略掉。  
      
      **dev.conf.js**
    ![image.png](https://img12.360buyimg.com/img/s1606x1156_jfs/t1/210928/26/27281/154177/635a1f86Eba8950a6/f2c515f0de7fb3b5.png)  
      **pro.conf.js**
    ![image.png](https://img12.360buyimg.com/img/s1548x1638_jfs/t1/189426/33/28456/234417/635a1fa7E31d64d4f/29311f6b5d73342d.png)
    - **3. 开启 SWC 编译**   
    SWC 是基于 Rust 实现的一款开发工具，既可用于编译也可用于打包，据官方言，它比 Babel 快了 20~70倍，NextJS 在 12 版本默认打开了 SWC 的支持。开启 SWC 后，应用的编译速度将比 Babel 快 17 倍，刷新速度快 5 倍。需要注意的是如果你通过`.babelrc`自定义 babel 配置，SWC 的一些特性将会被关闭。

### 3.3 优化后
从以下指标可以看出我们应用的体验得到了很大提升, 实际的一个交互体验也好了不少，在路由跳转上实现了类似 SPA 的一个体验，即使是各页面资源按需加载不会再出现页面卡顿的情况。  
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5f27a6708cb4b88a9c3a4d50d5b8558~tplv-k3u1fbpfcp-watermark.image?)
- FCP: 首次内容绘制时间 从 1.8s 优化到 0.35s，`提升了近 80%`

    ![image.png](https://img12.360buyimg.com/img/s744x308_jfs/t1/64774/26/18615/51495/635a2005Ea099be6b/22e7daa1c3b52d32.png)

- lighthouse: 评分从55提升到了80，TTI 从7.3s 优化到了 2.4s,  `分别提升了 30% / 64%，chrome 的最佳实践分达到了满分`💯

    ![](https://img12.360buyimg.com/img/s1420x1066_jfs/t1/21457/7/20560/130270/635a21ebEc7f74eb2/fe28f390371dc423.png)

- network: DomContentLoaded 从 2.42s 优化到 0.67s，Load从 3.77s 优化到 1.47s ，`分别提升了 77% / 61%`
    
    ![image.png](https://img12.360buyimg.com/img/s1356x46_jfs/t1/211937/2/22360/25045/635a210cE90e7a5be/5b32e5f52fa1b04a.png)

- 页面构建时间: 基本满足了毫秒级实现页面编译的需求，`提升了 70% 以上`
    
    ![image.png](https://img12.360buyimg.com/img/s788x288_jfs/t1/18544/35/19546/95956/635a2240E75308acc/6ca44e562d7e7f54.png)
    
![image.png](https://img12.360buyimg.com/img/s1280x720_jfs/t1/148389/20/28223/31720/635a227aE2dd62cd0/10de64723d1c963c.jpg)

## 四、后续规划
为了实现更为极致的用户体验，我们后续计划将资源上CDN，减少`Waiting for server response`的性能损耗，并加入`PWA`的离线缓存特性。


参考文章  
[Optimize Next.js App Bundle and Improve Its Performance](https://www.syncfusion.com/blogs/post/optimize-next-js-app-bundle-improve-its-performance.aspx)  
[我看Next.js：一个更现代的海王](https://baijiahao.baidu.com/s?id=1715929965351295334&wfr=spider&for=pc)

