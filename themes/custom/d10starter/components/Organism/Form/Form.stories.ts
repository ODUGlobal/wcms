import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import FormTemplate from './Form.twig';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { TwingMarkup } from 'twing';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [
  null,
  Theme.Default,
  Theme.LightBlue100,
  Theme.LightBlue500,
  Theme.Navy500,
  Theme.MidBlue500,
] as const;

const FormPureComponent = (twigContext: FormTwigContext) =>
  FormTemplate(twigContext);

export type FormTwigContext = {
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
  editorial?: EditorialTwigContext;
  heading?: HeadingTwigContext;
  /**
   * Should be some kind of markup.
   * In Storybook, will be demo form-markup.
   * On Drupal site, could be inline `<script>` tags that generate the form dynamically.
   */
  form: string | TwingMarkup;
};

const meta: Meta = {
  title: 'Organism/Form',
  excludeStories: ['Form', 'defaultForm'],
};

export default meta;

export const defaultForm = ({
  theme,
  id,
  verticalRhythm,
  editorial,
  withEditorial,
  heading,
  headline,
  form,
}: FormArgs): FormTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  // this giant sample form is just copy-pasted from the old ODUGlobal site's homepage, but without the `<script>` tags
  form =
    form ||
    /* html */ `
      <article class="embederator embederator--formassembly">
        <div class="embed">
          <!-- THEME DEBUG --><!-- THEME HOOK: 'field' --><!-- FILE NAME SUGGESTIONS:
        * field--embederator--embed-id--formassembly.html.twig
        * field--embederator--embed-id.html.twig
        * field--embederator--formassembly.html.twig
        * field--embed-id.html.twig
        * field--string.html.twig
        x field.html.twig
      --><!-- BEGIN OUTPUT from 'themes/custom/newcity/templates/field.html.twig' -->
          <div
            class="field field--name-embed-id field--type-string field--label-hidden field__item"
          >
            <!-- FORM: HEAD SECTION --><meta
              http-equiv="Content-Type"
              content="text/html; charset=utf-8"
            /><meta
              name="referrer"
              content="no-referrer-when-downgrade"
            />
            <link
              href="https://olddominion.tfaforms.net/dist/form-builder/5.0.0/wforms-layout.css?v=127d5d34f78f067204f2463a3699a1688fbf2ca7"
              rel="stylesheet"
              type="text/css"
            /><link
              href="https://olddominion.tfaforms.net/uploads/themes/theme-36.css"
              rel="stylesheet"
              type="text/css"
            /><link
              href="https://olddominion.tfaforms.net/dist/form-builder/5.0.0/wforms-jsonly.css?v=127d5d34f78f067204f2463a3699a1688fbf2ca7"
              rel="stylesheet"
              title=""
              type="text/css"
            />
            <!-- FORM: BODY SECTION -->
            <div class="wFormContainer">
              <div class="wFormHeader"></div>
              <style type="text/css">
                #tfa_1,
                *[id^="tfa_1["] {
                  width: 200px !important;
                }
                #tfa_1-D,
                *[id^="tfa_1["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_144,
                *[id^="tfa_144["] {
                  width: 200px !important;
                }
                #tfa_144-D,
                *[id^="tfa_144["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_2,
                *[id^="tfa_2["] {
                  width: 200px !important;
                }
                #tfa_2-D,
                *[id^="tfa_2["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_4,
                *[id^="tfa_4["] {
                  width: 200px !important;
                }
                #tfa_4-D,
                *[id^="tfa_4["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_167,
                *[id^="tfa_167["] {
                  width: 200px !important;
                }
                #tfa_167-D,
                *[id^="tfa_167["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_135,
                *[id^="tfa_135["] {
                  width: 200px !important;
                }
                #tfa_135-D,
                *[id^="tfa_135["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_191,
                *[id^="tfa_191["] {
                  width: 200px !important;
                }
                #tfa_191-D,
                *[id^="tfa_191["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_5,
                *[id^="tfa_5["] {
                  width: 200px !important;
                }
                #tfa_5-D,
                *[id^="tfa_5["][class~="field-container-D"] {
                  width: auto !important;
                }
      
                #tfa_217-L,
                label[id^="tfa_217["] {
                  width: 0px !important;
                  min-width: 0px;
                }
      
                #tfa_211-L,
                label[id^="tfa_211["] {
                  width: 0px !important;
                  min-width: 0px;
                }
              </style>
              <div class="">
                <div class="wForm" id="217767-WRPR" dir="ltr">
                  <div class="codesection" id="code-217767">
                    <style>
                      .label {
                        background-color: none !important;
                      }
                      .captchaHelp {
                        display: none !important;
                      }
                      div.wForm input,
                      div.wForm select {
                        width: 200px !important;
                      }
                      div.wForm .choices.horizontal input {
                        width: auto !important;
                      }
                      #tfa_212-L {
                        font-weight: normal;
                        font-size: 0.8125rem;
                        line-height: 1rem;
                      }
                      #tfa_219-D {
                        margin-top: 5px !important;
                      }
                      #tfa_220-L,
                      #tfa_221-L {
                        font-weight: normal !important;
                      }
                      #tfa_184-D {
                        border: 0;
                        clip: rect(0 0 0 0);
                        height: 1px;
                        margin: -1px;
                        overflow: hidden;
                        padding: 0;
                        position: absolute;
                        width: 1px;
                      }
                      div.wForm {
                        font-weight: bold;
                      }
                      div.htmlContent {
                        font-weight: normal !important;
                      }
                      div.wFormContainer {
                        padding: 0;
                        margin: 0;
                      }
                      .formAssemblyIframe .wFormWebPage,
                      .formAssemblyIframe .wFormContainer .wForm {
                        background: transparent;
                        padding: 0;
                        font-family: inherit;
                      }
                      .formAssemblyIframe .wFormContainer {
                        font-family: "Open Sans", sans-serif;
                        color: inherit;
                        margin: 0;
                      }
                      .formAssemblyIframe .wFormContainer .wFormHeader,
                      .formAssemblyIframe .wFormContainer .wFormFooter,
                      .formAssemblyIframe .wFormContainer .supportInfo {
                        display: none;
                      }
                      .formAssemblyIframe .wFormContainer .wForm div > div.oneField {
                        margin-top: 0.5rem;
                      }
                      .formAssemblyIframe .wFormContainer .wForm .actions {
                        padding: 0;
                      }
                      .formAssemblyIframe .wFormContainer .wForm .primaryAction {
                        font-size: 1.25rem;
                        line-height: 1.25rem;
                        display: inline-block;
                        margin: 0 0.5rem 0 0;
                        padding: 0.75rem 1.5rem;
                        -webkit-transition: 0.2s ease-in-out;
                        transition: 0.2s ease-in-out;
                        border-style: solid;
                        font-family: "Barlow Condensed", "Arial Bold", "Arial",
                          sans-serif;
                        font-weight: bold;
                        text-align: center;
                        text-transform: uppercase;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        border-color: #3f79b9;
                        background: #3f79b9;
                        color: #fff;
                      }
                      @media screen and (min-width: 80.25rem) {
                        .formAssemblyIframe .wFormContainer .wForm .primaryAction {
                          font-size: 1.25rem;
                          line-height: 1.25rem;
                        }
                      }
                      .formAssemblyIframe
                        .wFormContainer
                        .wForm
                        .primaryAction:hover {
                        color: #fff;
                        border-color: #003057;
                        background: #003057;
                      }
                      .formAssemblyIframe .wFormContainer .wForm .htmlSection span,
                      .formAssemblyIframe .wFormContainer .wForm .htmlSection i {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                      }
                      .formAssemblyIframe .wFormContainer .wForm select {
                        -webkit-appearance: none;
                        -webkit-border-radius: 0px;
                        background-color: #fff;
                        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAEBAMAAABB42PDAAAAD1BMVEUAAAA0NDQzMzMzMzP///+isCFkAAAAA3RSTlMAgIgilleHAAAAAWJLR0QEj2jZUQAAABxJREFUCB1jUDY2NmJgNDYWYGAQNmRgYGAUYAAAFJEBiN5ZPCIAAAAASUVORK5CYII=");
                        background-repeat: no-repeat;
                        background-position: calc(100% - 0.5rem) 50%;
                        background-size: 8px 4px;
                      }
                      .formAssemblyIframe .wFormContainer .wForm select::-ms-expand {
                        display: none;
                      }
                      .formAssemblyIframe .wFormContainer .wForm select,
                      .formAssemblyIframe .wFormContainer .wForm input[type="text"] {
                        height: 2.625rem;
                        display: block;
                        padding-left: 0.5rem;
                        padding-right: 0.5rem;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        max-width: 17.5rem;
                      }
                      @media screen and (min-width: 35rem) {
                        .formAssemblyIframe .wFormContainer .wForm select,
                        .formAssemblyIframe
                          .wFormContainer
                          .wForm
                          input[type="text"] {
                          max-width: 31.25rem;
                        }
                      }
                    </style>
                  </div>
                  <form
                    method="post"
                    action="https://olddominion.tfaforms.net/api_v2/rest/workflow/processor"
                    class="hintsBelow labelsAbove"
                    id="217767"
                    role="form"
                  >
                    <div id="tfa_3" class="section inline group">
                      <div class="oneField field-container-D" id="tfa_1-D">
                        <label id="tfa_1-L" class="label preField reqMark" for="tfa_1"
                          >First Name</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            aria-required="true"
                            type="text"
                            id="tfa_1"
                            name="tfa_1"
                            value=""
                            title="First Name"
                            class="required"
                          />
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_144-D">
                        <label
                          id="tfa_144-L"
                          class="label preField reqMark"
                          for="tfa_144"
                          >Last Name (Surname)</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            aria-required="true"
                            type="text"
                            id="tfa_144"
                            name="tfa_144"
                            value=""
                            title="Last Name (Surname)"
                            class="required"
                          />
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_2-D">
                        <label id="tfa_2-L" class="label preField reqMark" for="tfa_2"
                          >Email Address</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            aria-required="true"
                            type="text"
                            id="tfa_2"
                            name="tfa_2"
                            value=""
                            title="Email Address"
                            class="validate-email required"
                          />
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_4-D">
                        <label id="tfa_4-L" class="label preField" for="tfa_4"
                          >Mobile Number</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            type="text"
                            id="tfa_4"
                            name="tfa_4"
                            value=""
                            title="Mobile Number"
                            class=""
                          />
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_167-D">
                        <label
                          id="tfa_167-L"
                          class="label preField reqMark"
                          for="tfa_167"
                          >Zip / Postal Code</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            aria-required="true"
                            type="text"
                            id="tfa_167"
                            name="tfa_167"
                            value=""
                            title="Zip / Postal Code"
                            class="required"
                          />
                        </div>
                      </div>
                      <div
                        class="oneField field-container-D labelsAbove"
                        id="tfa_219-D"
                        role="radiogroup"
                        aria-labelledby="tfa_219-L"
                        data-tfa-labelledby="-L tfa_219-L"
                      >
                        <label id="tfa_219-L" class="label preField"
                          >U.S. military servicemember<br />or dependent?</label
                        ><br />
                        <div class="inputWrapper">
                          <span id="tfa_219" class="choices horizontal"
                            ><span class="oneChoice"
                              ><input
                                type="radio"
                                value="tfa_220"
                                class=""
                                id="tfa_220"
                                name="tfa_219"
                                aria-labelledby="tfa_220-L"
                                data-tfa-labelledby="tfa_219-L tfa_220-L"
                              /><label
                                class="label postField"
                                id="tfa_220-L"
                                for="tfa_220"
                                ><span class="input-radio-faux"></span>Yes</label
                              ></span
                            ><span class="oneChoice"
                              ><input
                                type="radio"
                                value="tfa_221"
                                class=""
                                id="tfa_221"
                                name="tfa_219"
                                aria-labelledby="tfa_221-L"
                                data-tfa-labelledby="tfa_219-L tfa_221-L"
                              /><label
                                class="label postField"
                                id="tfa_221-L"
                                for="tfa_221"
                                ><span class="input-radio-faux"></span>No</label
                              ></span
                            ></span
                          >
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_135-D">
                        <label id="tfa_135-L" class="label preField" for="tfa_135"
                          >Anticipated Start Date</label
                        ><br />
                        <div class="inputWrapper">
                          <select
                            id="tfa_135"
                            name="tfa_135"
                            title="Anticipated Start Date"
                            class=""
                          >
                            <option value="">Please select...</option>
                            <option value="tfa_216" id="tfa_216" class="">
                              Summer 2023
                            </option>
                            <option value="tfa_171" id="tfa_171" class="">
                              Fall 2023
                            </option>
                            <option value="tfa_208" id="tfa_208" class="">
                              Spring 2024
                            </option>
                            <option value="tfa_140" id="tfa_140" class="">
                              Unsure
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_191-D">
                        <label
                          id="tfa_191-L"
                          class="label preField reqMark"
                          for="tfa_191"
                          >Area of Study</label
                        ><br />
                        <div class="inputWrapper">
                          <select
                            aria-required="true"
                            id="tfa_191"
                            name="tfa_191"
                            data-filter-dependent="#tfa_5"
                            title="Area of Study"
                            class="required"
                          >
                            <option value="">Please select...</option>
                            <option value="tfa_192" id="tfa_192" class="">
                              Business &amp; Management
                            </option>
                            <option value="tfa_194" id="tfa_194" class="">
                              Communication &amp; Writing
                            </option>
                            <option value="tfa_196" id="tfa_196" class="">
                              Computer Science &amp; Math
                            </option>
                            <option value="tfa_198" id="tfa_198" class="">
                              Education
                            </option>
                            <option value="tfa_200" id="tfa_200" class="">
                              Engineering
                            </option>
                            <option value="tfa_202" id="tfa_202" class="">
                              Health Sciences &amp; Nursing
                            </option>
                            <option value="tfa_204" id="tfa_204" class="">
                              Social Sciences
                            </option>
                            <option value="tfa_206" id="tfa_206" class="">
                              Military Affiliated
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="oneField field-container-D" id="tfa_5-D">
                        <label id="tfa_5-L" class="label preField reqMark" for="tfa_5"
                          >Program of Interest</label
                        ><br />
                        <div class="inputWrapper">
                          <select
                            aria-required="true"
                            id="tfa_5"
                            name="tfa_5"
                            data-filter-control="#tfa_191"
                            title="Program of Interest"
                            class="required"
                          >
                            <option value="">Please select...</option>
                            <span
                              ><optgroup
                                id="tfa_193"
                                label="Business &amp; Management"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_10"
                                  id="tfa_10"
                                  class=""
                                  disabled=""
                                >
                                  Accounting (BSBA)
                                </option>
                                <option
                                  value="tfa_15"
                                  id="tfa_15"
                                  class=""
                                  disabled=""
                                >
                                  Business Administration (BSBA)
                                </option>
                                <option
                                  value="tfa_16"
                                  id="tfa_16"
                                  class=""
                                  disabled=""
                                >
                                  Business Administration (MBA)
                                </option>
                                <option
                                  value="tfa_183"
                                  id="tfa_183"
                                  class=""
                                  disabled=""
                                >
                                  Business Analytics (BSBA)
                                </option>
                                <option
                                  value="tfa_17"
                                  id="tfa_17"
                                  class=""
                                  disabled=""
                                >
                                  Business Analytics and Big Data (Cert)
                                </option>
                                <option
                                  value="tfa_186"
                                  id="tfa_186"
                                  class=""
                                  disabled=""
                                >
                                  Economics (BSBA)
                                </option>
                                <option
                                  value="tfa_170"
                                  id="tfa_170"
                                  class=""
                                  disabled=""
                                >
                                  Entrepreneurship (Undergraduate) (Cert)
                                </option>
                                <option
                                  value="tfa_145"
                                  id="tfa_145"
                                  class=""
                                  disabled=""
                                >
                                  Fashion Merchandising (Occupational &amp; Technical
                                  Studies) (BS)
                                </option>
                                <option
                                  value="tfa_52"
                                  id="tfa_52"
                                  class=""
                                  disabled=""
                                >
                                  Finance (BSBA)
                                </option>
                                <option
                                  value="tfa_166"
                                  id="tfa_166"
                                  class=""
                                  disabled=""
                                >
                                  Homeland Security (Cert)
                                </option>
                                <option
                                  value="tfa_57"
                                  id="tfa_57"
                                  class=""
                                  disabled=""
                                >
                                  Human Performance Technology (Cert)
                                </option>
                                <option
                                  value="tfa_58"
                                  id="tfa_58"
                                  class=""
                                  disabled=""
                                >
                                  Human Resource - Training (Occupational and
                                  Technical Studies) (PhD)
                                </option>
                                <option
                                  value="tfa_61"
                                  id="tfa_61"
                                  class=""
                                  disabled=""
                                >
                                  Information Systems &amp; Technology (BSBA)
                                </option>
                                <option
                                  value="tfa_64"
                                  id="tfa_64"
                                  class=""
                                  disabled=""
                                >
                                  Leadership (Interdisciplinary Studies) (BS)
                                </option>
                                <option
                                  value="tfa_66"
                                  id="tfa_66"
                                  class=""
                                  disabled=""
                                >
                                  Management (BSBA)
                                </option>
                                <option
                                  value="tfa_181"
                                  id="tfa_181"
                                  class=""
                                  disabled=""
                                >
                                  Maritime Trade and Supply Chain Management (MS)
                                </option>
                                <option
                                  value="tfa_67"
                                  id="tfa_67"
                                  class=""
                                  disabled=""
                                >
                                  Maritime, Ports &amp; Logistics Management (Cert)
                                </option>
                                <option
                                  value="tfa_68"
                                  id="tfa_68"
                                  class=""
                                  disabled=""
                                >
                                  Marketing (BSBA)
                                </option>
                                <option
                                  value="tfa_151"
                                  id="tfa_151"
                                  class=""
                                  disabled=""
                                >
                                  Professional Leadership (Undergraduate) (Cert)
                                </option>
                                <option
                                  value="tfa_100"
                                  id="tfa_100"
                                  class=""
                                  disabled=""
                                >
                                  Project Management (Cert)
                                </option>
                                <option
                                  value="tfa_102"
                                  id="tfa_102"
                                  class=""
                                  disabled=""
                                >
                                  Public Administration (MPA)
                                </option>
                                <option
                                  value="tfa_187"
                                  id="tfa_187"
                                  class=""
                                  disabled=""
                                >
                                  Public Administration and Policy (Cert)
                                </option>
                                <option
                                  value="tfa_104"
                                  id="tfa_104"
                                  class=""
                                  disabled=""
                                >
                                  Public Administration and Policy (PhD)
                                </option>
                                <option
                                  value="tfa_107"
                                  id="tfa_107"
                                  class=""
                                  disabled=""
                                >
                                  Public Procurement &amp; Contract Management (Cert)
                                </option>
                                <option
                                  value="tfa_108"
                                  id="tfa_108"
                                  class=""
                                  disabled=""
                                >
                                  Public Sector Leadership (Cert)
                                </option>
                                <option
                                  value="tfa_160"
                                  id="tfa_160"
                                  class=""
                                  disabled=""
                                >
                                  Real Estate (BSBA)
                                </option>
                                <option
                                  value="tfa_161"
                                  id="tfa_161"
                                  class=""
                                  disabled=""
                                >
                                  Risk Management and Insurance (BSBA)
                                </option>
                                <option
                                  value="tfa_122"
                                  id="tfa_122"
                                  class=""
                                  disabled=""
                                >
                                  Sport Management (MS)
                                </option>
                                <option
                                  value="tfa_172"
                                  id="tfa_172"
                                  class=""
                                  disabled=""
                                >
                                  Supply Chain Management (Cert)
                                </option>
                                <option
                                  value="tfa_127"
                                  id="tfa_127"
                                  class=""
                                  disabled=""
                                >
                                  Training Specialist (Occupational &amp; Technical
                                  Studies) (BS)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_195"
                                label="Communication &amp; Writing"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_23"
                                  id="tfa_23"
                                  class=""
                                  disabled=""
                                >
                                  Communication (BS/BA)
                                </option>
                                <option
                                  value="tfa_173"
                                  id="tfa_173"
                                  class=""
                                  disabled=""
                                >
                                  Communication (MA)
                                </option>
                                <option
                                  value="tfa_50"
                                  id="tfa_50"
                                  class=""
                                  disabled=""
                                >
                                  English - Technical Writing concentration (MA)
                                </option>
                                <option
                                  value="tfa_49"
                                  id="tfa_49"
                                  class=""
                                  disabled=""
                                >
                                  English (PhD)
                                </option>
                                <option
                                  value="tfa_98"
                                  id="tfa_98"
                                  class=""
                                  disabled=""
                                >
                                  Professional Writing (Interdisciplinary Studies)
                                  (BS)
                                </option>
                                <option
                                  value="tfa_154"
                                  id="tfa_154"
                                  class=""
                                  disabled=""
                                >
                                  Professional Writing (Cert)
                                </option>
                                <option
                                  value="tfa_155"
                                  id="tfa_155"
                                  class=""
                                  disabled=""
                                >
                                  Technical Writing (Undergraduate) (Cert)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_197"
                                label="Computer Science &amp; Math"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_28"
                                  id="tfa_28"
                                  class=""
                                  disabled=""
                                >
                                  Computer Science (BSCS)
                                </option>
                                <option
                                  value="tfa_29"
                                  id="tfa_29"
                                  class=""
                                  disabled=""
                                >
                                  Computer Science (MS)
                                </option>
                                <option
                                  value="tfa_35"
                                  id="tfa_35"
                                  class=""
                                  disabled=""
                                >
                                  Cybersecurity (BS)
                                </option>
                                <option
                                  value="tfa_33"
                                  id="tfa_33"
                                  class=""
                                  disabled=""
                                >
                                  Cybersecurity (Cert)
                                </option>
                                <option
                                  value="tfa_34"
                                  id="tfa_34"
                                  class=""
                                  disabled=""
                                >
                                  Cybersecurity (MS)
                                </option>
                                <option
                                  value="tfa_190"
                                  id="tfa_190"
                                  class=""
                                  disabled=""
                                >
                                  Data Science and Analytics (MS)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_199"
                                label="Education"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_13"
                                  id="tfa_13"
                                  class=""
                                  disabled=""
                                >
                                  Autism Spectrum Disorders (Cert)
                                </option>
                                <option
                                  value="tfa_19"
                                  id="tfa_19"
                                  class=""
                                  disabled=""
                                >
                                  Career and Technical Education (Occupational &amp;
                                  Technical Studies) (PhD)
                                </option>
                                <option
                                  value="tfa_26"
                                  id="tfa_26"
                                  class=""
                                  disabled=""
                                >
                                  Community College Leadership (Cert)
                                </option>
                                <option
                                  value="tfa_25"
                                  id="tfa_25"
                                  class=""
                                  disabled=""
                                >
                                  Community College Leadership (PhD)
                                </option>
                                <option
                                  value="tfa_38"
                                  id="tfa_38"
                                  class=""
                                  disabled=""
                                >
                                  Educational Leadership - Admin. &amp; Supervision
                                  K-12 (MSEd)
                                </option>
                                <option
                                  value="tfa_210"
                                  id="tfa_210"
                                  class=""
                                  disabled=""
                                >
                                  Educational Leadership (PhD)
                                </option>
                                <option
                                  value="tfa_39"
                                  id="tfa_39"
                                  class=""
                                  disabled=""
                                >
                                  Educational Leadership with Licensure (EdS)
                                </option>
                                <option
                                  value="tfa_41"
                                  id="tfa_41"
                                  class=""
                                  disabled=""
                                >
                                  Elementary Education (BS)
                                </option>
                                <option
                                  value="tfa_42"
                                  id="tfa_42"
                                  class=""
                                  disabled=""
                                >
                                  Elementary Education - PreK-6 Post Baccalaureate
                                  Endorsement (End/Lic)
                                </option>
                                <option
                                  value="tfa_44"
                                  id="tfa_44"
                                  class=""
                                  disabled=""
                                >
                                  Elementary Teacher PreK-6 with initial VA licensure
                                  (MSEd)
                                </option>
                                <option
                                  value="tfa_43"
                                  id="tfa_43"
                                  class=""
                                  disabled=""
                                >
                                  Elementary Education for Licensed Teachers (MSEd)
                                </option>
                                <option
                                  value="tfa_63"
                                  id="tfa_63"
                                  class=""
                                  disabled=""
                                >
                                  Instructional Design &amp; Technology (MSEd)
                                </option>
                                <option
                                  value="tfa_62"
                                  id="tfa_62"
                                  class=""
                                  disabled=""
                                >
                                  Instructional Design &amp; Technology (PhD)
                                </option>
                                <option
                                  value="tfa_147"
                                  id="tfa_147"
                                  class=""
                                  disabled=""
                                >
                                  Library &amp; Information Studies (MLIS)
                                </option>
                                <option
                                  value="tfa_146"
                                  id="tfa_146"
                                  class=""
                                  disabled=""
                                >
                                  Library &amp; Information Studies - School
                                  Librarianship (MLIS)
                                </option>
                                <option
                                  value="tfa_157"
                                  id="tfa_157"
                                  class=""
                                  disabled=""
                                >
                                  Marketing Education (BS)
                                </option>
                                <option
                                  value="tfa_182"
                                  id="tfa_182"
                                  class=""
                                  disabled=""
                                >
                                  Marketing Education - Initial Licensure Post
                                  Baccalaureate Endorsement (End)
                                </option>
                                <option
                                  value="tfa_71"
                                  id="tfa_71"
                                  class=""
                                  disabled=""
                                >
                                  Mathematics Specialist - Elementary Education (MSEd)
                                </option>
                                <option
                                  value="tfa_70"
                                  id="tfa_70"
                                  class=""
                                  disabled=""
                                >
                                  Mathematics Specialist (PreK-8) Endorsement (End)
                                </option>
                                <option
                                  value="tfa_95"
                                  id="tfa_95"
                                  class=""
                                  disabled=""
                                >
                                  Online Teaching for K-12 (Cert)
                                </option>
                                <option
                                  value="tfa_209"
                                  id="tfa_209"
                                  class=""
                                  disabled=""
                                >
                                  Reading - Non-Licensure (MSEd)
                                </option>
                                <option
                                  value="tfa_109"
                                  id="tfa_109"
                                  class=""
                                  disabled=""
                                >
                                  Reading Education - Reading Specialist (MSEd)
                                </option>
                                <option
                                  value="tfa_175"
                                  id="tfa_175"
                                  class=""
                                  disabled=""
                                >
                                  School Library Practice (Cert)
                                </option>
                                <option
                                  value="tfa_112"
                                  id="tfa_112"
                                  class=""
                                  disabled=""
                                >
                                  Secondary Education (6-12) Post Baccalaureate
                                  Endorsement (End)
                                </option>
                                <option
                                  value="tfa_113"
                                  id="tfa_113"
                                  class=""
                                  disabled=""
                                >
                                  Secondary Education (6-12) with initial Virginia
                                  licensure (MSEd)
                                </option>
                                <option
                                  value="tfa_114"
                                  id="tfa_114"
                                  class=""
                                  disabled=""
                                >
                                  Secondary Education for Licensed Teachers (MSEd)
                                </option>
                                <option
                                  value="tfa_115"
                                  id="tfa_115"
                                  class=""
                                  disabled=""
                                >
                                  Secondary Education Professional Studies (Cert)
                                </option>
                                <option
                                  value="tfa_117"
                                  id="tfa_117"
                                  class=""
                                  disabled=""
                                >
                                  Special Education (BS)
                                </option>
                                <option
                                  value="tfa_121"
                                  id="tfa_121"
                                  class=""
                                  disabled=""
                                >
                                  Special Education Post Baccalaureate Endorsement
                                  (End)
                                </option>
                                <option
                                  value="tfa_120"
                                  id="tfa_120"
                                  class=""
                                  disabled=""
                                >
                                  Special Education - VA Licensure (MSEd)
                                </option>
                                <option
                                  value="tfa_215"
                                  id="tfa_215"
                                  class=""
                                  disabled=""
                                >
                                  Teacher Leadership (Cert)
                                </option>
                                <option
                                  value="tfa_153"
                                  id="tfa_153"
                                  class=""
                                  disabled=""
                                >
                                  Teaching English as a Second Language
                                  (Undergraduate) (Cert)
                                </option>
                                <option
                                  value="tfa_156"
                                  id="tfa_156"
                                  class=""
                                  disabled=""
                                >
                                  Technology Education (BS)
                                </option>
                                <option
                                  value="tfa_126"
                                  id="tfa_126"
                                  class=""
                                  disabled=""
                                >
                                  Technology Education Endorsement (End)
                                </option>
                                <option
                                  value="tfa_125"
                                  id="tfa_125"
                                  class=""
                                  disabled=""
                                >
                                  Technology Education (Occupational &amp; Technical
                                  Studies) (PhD)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_201"
                                label="Engineering"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_12"
                                  id="tfa_12"
                                  class=""
                                  disabled=""
                                >
                                  Aerospace Engineering (MS/ME)
                                </option>
                                <option
                                  value="tfa_21"
                                  id="tfa_21"
                                  class=""
                                  disabled=""
                                >
                                  Civil Engineering Technology (BSET)
                                </option>
                                <option
                                  value="tfa_20"
                                  id="tfa_20"
                                  class=""
                                  disabled=""
                                >
                                  Civil Engineering - Coastal Engineering focus (MS)
                                </option>
                                <option
                                  value="tfa_22"
                                  id="tfa_22"
                                  class=""
                                  disabled=""
                                >
                                  Coastal Engineering (CECP) (Cert)
                                </option>
                                <option
                                  value="tfa_24"
                                  id="tfa_24"
                                  class=""
                                  disabled=""
                                >
                                  Communications Systems Technology (Electrical
                                  Engineering Technology) (BSET)
                                </option>
                                <option
                                  value="tfa_159"
                                  id="tfa_159"
                                  class=""
                                  disabled=""
                                >
                                  Computer Engineering (BSCOME)
                                </option>
                                <option
                                  value="tfa_27"
                                  id="tfa_27"
                                  class=""
                                  disabled=""
                                >
                                  Computer Engineering Technology (Electrical
                                  Engineering Technology) (BSET)
                                </option>
                                <option
                                  value="tfa_31"
                                  id="tfa_31"
                                  class=""
                                  disabled=""
                                >
                                  Cyber Systems Security (Cert)
                                </option>
                                <option
                                  value="tfa_40"
                                  id="tfa_40"
                                  class=""
                                  disabled=""
                                >
                                  Electrical and Computer Engineering (MS)
                                </option>
                                <option
                                  value="tfa_45"
                                  id="tfa_45"
                                  class=""
                                  disabled=""
                                >
                                  Embedded Systems Technology (Electrical Engineering
                                  Technology) (BSET)
                                </option>
                                <option
                                  value="tfa_47"
                                  id="tfa_47"
                                  class=""
                                  disabled=""
                                >
                                  Engineering Management (Cert)
                                </option>
                                <option
                                  value="tfa_46"
                                  id="tfa_46"
                                  class=""
                                  disabled=""
                                >
                                  Engineering Management (MEM)
                                </option>
                                <option
                                  value="tfa_165"
                                  id="tfa_165"
                                  class=""
                                  disabled=""
                                >
                                  Engineering Management and Systems Engineering (PhD)
                                </option>
                                <option
                                  value="tfa_51"
                                  id="tfa_51"
                                  class=""
                                  disabled=""
                                >
                                  Environmental Engineering (MS)
                                </option>
                                <option
                                  value="tfa_60"
                                  id="tfa_60"
                                  class=""
                                  disabled=""
                                >
                                  Industrial Technology (Occupational &amp; Technical
                                  Studies) (BS)
                                </option>
                                <option
                                  value="tfa_169"
                                  id="tfa_169"
                                  class=""
                                  disabled=""
                                >
                                  Industrial Training (Undergraduate) (Cert)
                                </option>
                                <option
                                  value="tfa_180"
                                  id="tfa_180"
                                  class=""
                                  disabled=""
                                >
                                  Mechanical Engineering (ME)
                                </option>
                                <option
                                  value="tfa_75"
                                  id="tfa_75"
                                  class=""
                                  disabled=""
                                >
                                  Mechanical Engineering Technology (BSET)
                                </option>
                                <option
                                  value="tfa_73"
                                  id="tfa_73"
                                  class=""
                                  disabled=""
                                >
                                  Mechatronics Systems Technology (Electrical
                                  Engineering Technology) (BSET)
                                </option>
                                <option
                                  value="tfa_79"
                                  id="tfa_79"
                                  class=""
                                  disabled=""
                                >
                                  Modeling and Simulation Engineering (Cert)
                                </option>
                                <option
                                  value="tfa_78"
                                  id="tfa_78"
                                  class=""
                                  disabled=""
                                >
                                  Modeling and Simulation (MS)
                                </option>
                                <option
                                  value="tfa_96"
                                  id="tfa_96"
                                  class=""
                                  disabled=""
                                >
                                  Power Systems Technology (Electrical Engineering
                                  Technology) (BSET)
                                </option>
                                <option
                                  value="tfa_124"
                                  id="tfa_124"
                                  class=""
                                  disabled=""
                                >
                                  Systems Engineering (ME)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_203"
                                label="Health Sciences &amp; Nursing"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_189"
                                  id="tfa_189"
                                  class=""
                                  disabled=""
                                >
                                  Adult Gerontology CNS Post-Professional (Cert)
                                </option>
                                <option
                                  value="tfa_36"
                                  id="tfa_36"
                                  class=""
                                  disabled=""
                                >
                                  Dental Hygiene (BSDH)
                                </option>
                                <option
                                  value="tfa_37"
                                  id="tfa_37"
                                  class=""
                                  disabled=""
                                >
                                  Dental Hygiene (MS)
                                </option>
                                <option
                                  value="tfa_54"
                                  id="tfa_54"
                                  class=""
                                  disabled=""
                                >
                                  Global Health (Cert)
                                </option>
                                <option
                                  value="tfa_55"
                                  id="tfa_55"
                                  class=""
                                  disabled=""
                                >
                                  Health Services Administration (BSHS)
                                </option>
                                <option
                                  value="tfa_74"
                                  id="tfa_74"
                                  class=""
                                  disabled=""
                                >
                                  Medical Laboratory Science (BSMLS)
                                </option>
                                <option
                                  value="tfa_188"
                                  id="tfa_188"
                                  class=""
                                  disabled=""
                                >
                                  Neonatal Physician Assistant (Cert)
                                </option>
                                <option
                                  value="tfa_81"
                                  id="tfa_81"
                                  class=""
                                  disabled=""
                                >
                                  Nurse Educator (Cert)
                                </option>
                                <option
                                  value="tfa_84"
                                  id="tfa_84"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Adult-Gerontology Clinical Nurse
                                  Specialist/Educator (MSN)
                                </option>
                                <option
                                  value="tfa_85"
                                  id="tfa_85"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Advanced Practice (DNP)
                                </option>
                                <option
                                  value="tfa_86"
                                  id="tfa_86"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Family Nurse Practitioner (MSN)
                                </option>
                                <option
                                  value="tfa_87"
                                  id="tfa_87"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Neonatal Clinical Nurse Specialist (MSN)
                                </option>
                                <option
                                  value="tfa_88"
                                  id="tfa_88"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Neonatal Nurse Practitioner (MSN)
                                </option>
                                <option
                                  value="tfa_90"
                                  id="tfa_90"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Nurse Executive (DNP)
                                </option>
                                <option
                                  value="tfa_224"
                                  id="tfa_224"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Nurse Midwifery (MSN)
                                </option>
                                <option
                                  value="tfa_92"
                                  id="tfa_92"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Pediatric Clinical Nurse Specialist (MSN)
                                </option>
                                <option
                                  value="tfa_93"
                                  id="tfa_93"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Pediatric Nurse Practitioner (MSN)
                                </option>
                                <option
                                  value="tfa_148"
                                  id="tfa_148"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Psychiatric Mental Health Nurse
                                  Practitioner (MSN)
                                </option>
                                <option
                                  value="tfa_222"
                                  id="tfa_222"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - Psychiatric Mental Health Nurse
                                  Practitioner (DNP)
                                </option>
                                <option
                                  value="tfa_94"
                                  id="tfa_94"
                                  class=""
                                  disabled=""
                                >
                                  Nursing - RN to BSN (BSN)
                                </option>
                                <option
                                  value="tfa_223"
                                  id="tfa_223"
                                  class=""
                                  disabled=""
                                >
                                  Psychiatric Mental Health Nurse Practitioner
                                  Post-Professional (Cert)
                                </option>
                                <option
                                  value="tfa_56"
                                  id="tfa_56"
                                  class=""
                                  disabled=""
                                >
                                  Public Health (BSPH)
                                </option>
                                <option
                                  value="tfa_106"
                                  id="tfa_106"
                                  class=""
                                  disabled=""
                                >
                                  Public Health (MPH)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_205"
                                label="Social Sciences"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_152"
                                  id="tfa_152"
                                  class=""
                                  disabled=""
                                >
                                  Addiction Prevention and Treatment (Undergraduate)
                                  (Cert)
                                </option>
                                <option
                                  value="tfa_30"
                                  id="tfa_30"
                                  class=""
                                  disabled=""
                                >
                                  Criminal Justice (BS/BA)
                                </option>
                                <option
                                  value="tfa_32"
                                  id="tfa_32"
                                  class=""
                                  disabled=""
                                >
                                  Cybercrime (Interdisciplinary Studies) (BS)
                                </option>
                                <option
                                  value="tfa_164"
                                  id="tfa_164"
                                  class=""
                                  disabled=""
                                >
                                  Geography (BS/BA)
                                </option>
                                <option
                                  value="tfa_59"
                                  id="tfa_59"
                                  class=""
                                  disabled=""
                                >
                                  Human Services (BS)
                                </option>
                                <option
                                  value="tfa_163"
                                  id="tfa_163"
                                  class=""
                                  disabled=""
                                >
                                  Political Science (BS/BA)
                                </option>
                                <option
                                  value="tfa_101"
                                  id="tfa_101"
                                  class=""
                                  disabled=""
                                >
                                  Psychology (BS)
                                </option>
                                <option
                                  value="tfa_116"
                                  id="tfa_116"
                                  class=""
                                  disabled=""
                                >
                                  Sociology (BS/BA)
                                </option>
                              </optgroup></span
                            ><span
                              ><optgroup
                                id="tfa_207"
                                label="Military Affiliated"
                                class="choiceGroup"
                                disabled=""
                                style="display: none"
                              >
                                <option
                                  value="tfa_48"
                                  id="tfa_48"
                                  class=""
                                  disabled=""
                                >
                                  Engineering Management by Portable Media (MEM)
                                </option>
                                <option
                                  value="tfa_77"
                                  id="tfa_77"
                                  class=""
                                  disabled=""
                                >
                                  Mission Analysis and Engineering (Cert)
                                </option>
                                <option
                                  value="tfa_76"
                                  id="tfa_76"
                                  class=""
                                  disabled=""
                                >
                                  Nuclear Systems (Mechanical Engineering Technology)
                                  (BSET)
                                </option>
                              </optgroup></span
                            >
                          </select>
                        </div>
                      </div>
                      <div
                        class="oneField field-container-D labelsRemoved"
                        id="tfa_217-D"
                        role="group"
                        aria-labelledby="tfa_217-L"
                        data-tfa-labelledby="-L tfa_217-L"
                      >
                        <div class="inputWrapper">
                          <span id="tfa_217" class="choices horizontal"
                            ><span class="oneChoice"
                              ><input
                                type="checkbox"
                                value="tfa_218"
                                class=""
                                id="tfa_218"
                                name="tfa_218"
                                aria-labelledby="tfa_218-L"
                                data-tfa-labelledby="tfa_217-L tfa_218-L"
                              /><label
                                class="label postField"
                                id="tfa_218-L"
                                for="tfa_218"
                                ><span class="input-checkbox-faux"></span>I have
                                credits I'd like to transfer.</label
                              ></span
                            ></span
                          >
                        </div>
                      </div>
                    </div>
                    <div
                      class="oneField field-container-D labelsRemoved"
                      id="tfa_211-D"
                      role="group"
                      aria-labelledby="tfa_211-L"
                      data-tfa-labelledby="-L tfa_211-L"
                      aria-required="true"
                    >
                      <div class="inputWrapper">
                        <span
                          id="tfa_211"
                          class="choices horizontal required"
                          aria-required="true"
                          ><span class="oneChoice"
                            ><input
                              type="checkbox"
                              value="tfa_212"
                              class=""
                              id="tfa_212"
                              name="tfa_212"
                              aria-labelledby="tfa_212-L"
                              data-tfa-labelledby="tfa_211-L tfa_212-L"
                            /><label
                              class="label postField"
                              id="tfa_212-L"
                              for="tfa_212"
                              ><span class="input-checkbox-faux"></span>By submitting
                              this form, I consent to receive calls, texts and emails
                              from Old Dominion University using the contact
                              information provided, including mobile numbers, which
                              may be sent with automated or pre-recorded technology.
                              Message &amp; data rates may apply. Consent is not a
                              condition of purchase and I may opt-out at any
                              time.</label
                            ></span
                          ></span
                        >
                      </div>
                    </div>
                    <div id="tfa_214" class="section inline group">
                      <div class="oneField field-container-D" id="tfa_184-D">
                        <label id="tfa_184-L" class="label preField" for="tfa_184"
                          >NCM Referral</label
                        ><br />
                        <div class="inputWrapper">
                          <input
                            type="text"
                            id="tfa_184"
                            name="tfa_184"
                            value=""
                            title="NCM Referral"
                            class="validate-custom /^$/"
                          />
                        </div>
                      </div>
                    </div>
                    <input
                      type="hidden"
                      id="tfa_129"
                  name="tfa_129"
                  value=""
                  class=""
                /><input
                  type="hidden"
                  id="tfa_130"
                  name="tfa_130"
                  value=""
                  class=""
                /><input
                  type="hidden"
                  id="tfa_141"
                  name="tfa_141"
                  value=""
                  class=""
                /><input
                  type="hidden"
                  id="tfa_142"
                  name="tfa_142"
                  value=""
                  class=""
                /><input
                  type="hidden"
                  id="tfa_143"
                  name="tfa_143"
                  value=""
                  class=""
                /><input
                  type="hidden"
                  id="tfa_179"
                  name="tfa_179"
                  value=""
                  class=""
                />
                <div class="actions" id="217767-A" data-contentid="submit_button">
                  <input
                    type="submit"
                    data-label="Submit Form"
                    class="primaryAction"
                    id="submit_button"
                    value="Submit Form"
                  />
                </div>
                <div style="clear: both"></div>
                <input
                  type="hidden"
                  value="518-88479dc6a20ac6461d0e7dc322a4e46d"
                  name="tfa_dbCounters"
                  id="tfa_dbCounters"
                  autocomplete="off"
                /><input
                  type="hidden"
                  value="217767"
                  name="tfa_dbFormId"
                  id="tfa_dbFormId"
                /><input
                  type="hidden"
                  value=""
                  name="tfa_dbResponseId"
                  id="tfa_dbResponseId"
                /><input
                  type="hidden"
                  value="e7c73867657a2a7976f8eb9400acfbea"
                  name="tfa_dbControl"
                  id="tfa_dbControl"
                /><input
                  type="hidden"
                  value=""
                  name="tfa_dbWorkflowSessionUuid"
                  id="tfa_dbWorkflowSessionUuid"
                /><input
                  type="hidden"
                  value="1683292896"
                  name="tfa_dbTimeStarted"
                  id="tfa_dbTimeStarted"
                  autocomplete="off"
                /><input
                  type="hidden"
                  value="102"
                  name="tfa_dbVersionId"
                  id="tfa_dbVersionId"
                /><input
                  type="hidden"
                  value=""
                  name="tfa_switchedoff"
                  id="tfa_switchedoff"
                />
              </form>
            </div>
          </div>
          <div class="wFormFooter">
            <p class="supportInfo"><br /></p>
          </div>
          <p class="supportInfo"></p>
        </div>
      </div>
    </div>
  </article>
  `;

  return {
    theme,
    id,
    verticalRhythm,
    editorial,
    heading,
    form,
  };
};

export const FormStory: Story<FormArgs> = {
  name: 'Form',

  parameters: {
    render: (args) => FormPureComponent(defaultForm(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: 'This is a form',
    withEditorial: true,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },
};

type FormArgs = Partial<FormTwigContext> & {
  headline?: string;
  withEditorial?: boolean;
};

export const Form = makeComponentInjector({
  pureComponent: FormPureComponent,
  storyRenderFn: FormStory.parameters.render,
  defaultArgs: FormStory.args,
});
