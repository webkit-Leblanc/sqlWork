import fetch from 'hife/fetch';

// export const domain = 'http://git.hugeinfo.com.cn/byfy-precase/';    
export const domain = 'http://localhost:8082/';
// export const domain = 'http://weixin.hugeinfo.com.cn/byfy-precase/';
// export const domain = 'http://192.168.0.195:5055/byfy-precase/';
// export const domain = ' http://weixin.hugeinfo.com.cn/byfy-precase/';


const localhost = window.location.origin;
// export const domain = localhost + '/byfy-precase/';

export default fetch(domain);