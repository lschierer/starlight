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

import { withBase } from '../utils/base';
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
    }

    const _href = withBase(this.locale || '/');

    return html`
            <sp-top-nav size="xl" style=${styleMap(styles)}>
              <sp-top-nav-item href='${_href}' >
                Test
              </sp-top-nav-item>
              <sp-top-nav-item>
                <SocialIcons />
              </sp-top-nav-item>
              <sp-top-nav-item>
                <LanguageSelect {locale} />
              </sp-top-nav-item>
              <sp-action-menu label="${this.t('themeSelect.accessibleLabel')}" style="margin-inline-start: auto;" quiet=true selects="single" value="auto">
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
            <script is:inline>
              StarlightThemeProvider.updatePickers();
            </script>

            <script>
              
                /** Update select menu UI, document theme, and local storage state. */
                #onThemeChange(theme: Theme): void {
                  StarlightThemeProvider.updatePickers(theme);
                  document.documentElement.dataset.theme =
                      theme === 'auto' ? this.#getPreferredColorScheme() : theme;
                  this.#storeTheme(theme);
                }

                /** Store the user’s preference in \`localStorage\`. */
                #storeTheme(theme: Theme): void {
                  if (typeof localStorage !== 'undefined') {
                    if (theme === 'light' || theme === 'dark') {
                      localStorage.setItem(this.#key, theme);
                    } else {
                      localStorage.removeItem(this.#key);
                    }
                  }
                }

                /** Load the user’s preference from \`localStorage\`. */
                #loadTheme(): Theme {
                  const theme =
                      typeof localStorage !== 'undefined' && localStorage.getItem(this.#key);
                  return this.#parseTheme(theme);
                }
              }

              customElements.define('starlight-theme-select', StarlightThemeSelect);
            </script>

    `
  }
}
