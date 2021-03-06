// Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
import '@angular/localize/init';

import 'core-js/es/array';
import 'core-js/es/date';
import 'core-js/es/function';
import 'core-js/es/map';
import 'core-js/es/math';
import 'core-js/es/number';
import 'core-js/es/object';
import 'core-js/es/parse-float';
import 'core-js/es/parse-int';
import 'core-js/es/reflect';
import 'core-js/es/regexp';
import 'core-js/es/set';
import 'core-js/es/string';
import 'core-js/es/symbol';

import 'zone.js/dist/zone';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

// Add global to window, assigning the value of window itself.
// eslint-disable-next-line
(window as any).global = window;

// Add global to process. Required by the 'swagger-ui'.
// eslint-disable-next-line
(window as any).process = {browser: true};
