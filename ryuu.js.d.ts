
declare module 'ryuu.js' {
  interface Domo {
    get: (url: string) => Promise<any>;
    post: (url: string, body: any) => Promise<any>;
    put: (url: string, body: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
  }
  const domo: Domo;
  export default domo;
}
