/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import _DrupalAttribute from 'drupal-attribute';

class DrupalAttribute {
  drupalAttribute: _DrupalAttribute;

  constructor(it?: []) {
    this.drupalAttribute = new _DrupalAttribute(it);
  }

  addClass(stringOrMap: string | Map<string, string>) {
    let stringArr: string[] | undefined = undefined;

    if (stringOrMap instanceof Map) {
      stringArr = Array.from(stringOrMap.values());
    } else {
      stringArr = [stringOrMap];
    }

    this.drupalAttribute.addClass(...stringArr);
    return this;
  }

  hasClass(value: string) {
    return this.drupalAttribute.hasClass(value);
  }

  removeAttribute(key: string) {
    this.drupalAttribute.removeAttribute(key);
    return this;
  }

  removeClass(value: string) {
    this.drupalAttribute.removeClass(value);
    return this;
  }

  setAttribute(key: string, value: string) {
    this.drupalAttribute.setAttribute(key, value);
    return this;
  }

  toString() {
    return this.drupalAttribute.toString();
  }
}

export default DrupalAttribute;
