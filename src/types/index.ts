// base
export interface InfoItem {
  name: string;
  name_en?: string;
  is_active?: boolean;
  desc?: string;
  detail?: string;
  url?: string;
  icon?: string;
  image?: string;
  video?: string;
}

export interface ContentItem {
  name: string;
  id?: string;
  desc?: string;
  link?: string;
  icon?: string;
  image?: string;
  image_mobile?: string;
  date?: string;
}

export interface ContentItemAboutRecruitment {
  name: string;
  address?: string;
  desc?: string;
  detail?: string;
  link?: string;
  date?: string;
}

export interface SectionItem {
  info?: InfoItem;
  content?: Array<ContentItem>;
}

// public
export type HeaderProdeuct = SectionItem;

export type HeaderSolution = SectionItem;

export type HeaderTechnology = {
  column?: SectionItem;
  periodical?: SectionItem;
  special?: SectionItem;
};

export type Header = {
  product?: HeaderProdeuct;
  solution?: HeaderSolution;
  technology?: HeaderTechnology;
};

export type FooterProduct = SectionItem;

export type FooterLink = SectionItem;

export type FooterContact = SectionItem;

export type Footer = {
  product?: FooterProduct;
  link?: FooterLink;
  contact?: FooterContact;
};

// home
export type HomeBanner = SectionItem;

export type HomeAchievement = SectionItem;

export type HomeProduct = SectionItem;

export type HomeTechnology = SectionItem;

export type HomeSolution = SectionItem;

export type HomeUser = SectionItem;

export type Home = {
  banner?: HomeBanner;
  achievement?: HomeAchievement;
  product?: HomeProduct;
  technology?: HomeTechnology;
  solution?: HomeSolution;
  user?: HomeUser;
};

// about
export type AboutIntro = SectionItem;

export type AboutChannel = SectionItem;

export type AboutRecruitment = SectionItem;

export type About = {
  intro: AboutIntro;
  channel: AboutChannel;
  recruitment: AboutRecruitment;
};
