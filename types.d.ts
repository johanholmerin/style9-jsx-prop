import {} from 'react';
import Style from 'style9/Style';

declare module 'react' {
  interface Attributes {
    css?: Style;
  }
}
