export interface ILocaleProps {
  params: Promise<{
    locale: string;
    navigationBar?: string;
    vcardCode: string;  
  }>;
}
