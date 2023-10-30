export class UrlUtilities {
  public static getUrlSearchParams(): URLSearchParams {
    const url = window.location.href;
    const queryStringFragments = url.split('?').splice(1).join();
    const urlSearch = new URLSearchParams(queryStringFragments);
    return urlSearch;
  }
}
