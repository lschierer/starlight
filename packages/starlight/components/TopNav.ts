import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';

import { TopNav, TopNavItem } from '@spectrum-web-components/top-nav';
import { ActionMenu } from '@spectrum-web-components/action-menu';
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuDivider
} from '@spectrum-web-components/menu';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

import { pathWithBase } from '../utils/base';
import { useTranslations } from '../utils/translations';
import { logos } from 'virtual:starlight/user-images';
import config from 'virtual:starlight/user-config';

import SocialIcons from './SocialIcons.astro';
import LanguageSelect from './LanguageSelect.astro';

import {CollectionEntry} from "astro:content";


interface Props {
  locale: string | undefined;
}

const tagName = 'top-nav';

@customElement('top-nav')
export class myTopNav extends LitElement  {

  private locale: string | undefined;

  private t: Record<string, CollectionEntry<'i18n'>['data']>;

  constructor(props: Props) {
    super();
    if(props !== undefined) {
      this.locale = props.locale || undefined;
    } else {
      this.locale = undefined;
    }
    this.t = useTranslations(this.locale);

  }

  override render(){
    const styles = {
      backgroundColor: 'var(--spectrum-cyan-600)',
      width: '100%',
    }
    let logo = undefined;
    if (config.logo) {
      let err: string | undefined;
      if ('src' in config.logo) {
        if (!logos.dark || !logos.light) {
          err = `Could not resolve logo import for "${config.logo.src}" (logo.src)`;
        }
        if (!logos.dark) {
          err = `Could not resolve logo import for "${config.logo.dark}" (logo.dark)`;
        } else if (!logos.light) {
          err = `Could not resolve logo import for "${config.logo.light}" (logo.light)`;
        }
      }
      if (err) throw new Error(err);
      else {
        if (config.logo && logos.dark) {
          logo = html`
            <img class="${{'dark-only': !('src' in config.logo) }}" alt=${config.logo.alt} src=${logos.dark.src} width=${logos.dark.width} height=${logos.dark.height} />
          `;
        } else if (!('src' in config.logo)) {
          logo = html`
            <img
                class="light-only"
                alt=${config.logo.alt}
                src=${logos.light?.src}
                width=${logos.light?.width}
                height=${logos.light?.height}
            />
          `;
        }

      }
      if(config.title && !(config.logo.replacesTitle)) {
        logo = logo + ' ' + config.title;
      }
    } else {
      logo = config.title;
    }

    const _href = pathWithBase(this.locale || '/');

    return html`
            <sp-top-nav size="xl" style=${styleMap(styles)}>
              <sp-top-nav-item href='${_href}' >
                ${logo}
              </sp-top-nav-item>
              <sp-top-nav-item>
                <SocialIcons />
              </sp-top-nav-item>
              <sp-top-nav-item>
                <LanguageSelect ${this.locale} />
              </sp-top-nav-item>
              <sp-action-menu 
                  label="${this.t('themeSelect.accessibleLabel')}" 
                  style="margin-inline-start: auto;" 
                  quiet=true selects="single" 
                  value="auto" 
                  onchange="
                document.documentElement.dataset.theme =
                    this.value === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches
                        ? 'light'
                        : 'dark') : this.value;
                if (typeof localStorage !== 'undefined') {
                  if (this.value === 'light' || this.value === 'dark') {
                    localStorage.setItem('starlight-theme', this.value);
                  } else {
                    localStorage.removeItem('starlight-theme');
                  }
                }
              ">
                <sp-icon-settings slot="icon"></sp-icon-settings>
                <sp-menu-item value="dark">
                  ${this.t('themeSelect.dark')}
                </sp-menu-item>
                <sp-menu-item value="light">
                  ${this.t('themeSelect.light')}
                </sp-menu-item>
                <sp-menu-item value="auto" >
                  ${this.t('themeSelect.auto')}
                </sp-menu-item>
              </sp-action-menu>
              <slot name="topnav" />
            </sp-top-nav>
   

   
    `
  }
}
