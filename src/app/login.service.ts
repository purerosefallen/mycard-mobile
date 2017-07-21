import { Injectable } from '@angular/core';
import { fromPairs } from 'lodash';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { User } from './ygopro.service';

@Injectable()
export class LoginService {

  user: User;
  token: string;

  login() {
    let params = new URLSearchParams();
    params.set('return_sso_url', location.href);
    let payload = Buffer.from(params.toString()).toString('base64');

    let url = new URL('https://accounts.moecube.com');
    params = url['searchParams'];
    params.set('sso', payload);

    // const key = await window.crypto.subtle.importKey(
    //   'jwk', //can be "jwk" or "raw"
    //   {   //this is an example jwk key, "raw" would be an ArrayBuffer
    //     kty: 'oct',
    //     k: 'zsZv6LXHDwwtUAGa',
    //     alg: 'HS256',
    //     ext: true,
    //   },
    //   {   //this is the algorithm options
    //     name: 'HMAC',
    //     hash: { name: 'SHA-256' }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    //     //length: 256, //optional, if you want your key length to differ from the hash function's block length
    //   },
    //   false, //whether the key is extractable (i.e. can be used in exportKey)
    //   ['sign', 'verify'] //can be any combination of "sign" and "verify"
    // );
    //
    // const sign = await window.crypto.subtle.sign(
    //   'HMAC',
    //   key, //from generateKey or importKey above
    //   new TextEncoder().encode(payload) //ArrayBuffer of data you want to sign
    // );
    // console.log(Buffer.from(new TextDecoder().decode(sign)).toString('hex'));
    // params.set('sig', crypto.createHmac('sha256', 'zsZv6LXHDwwtUAGa').update(payload).digest('hex'));
    return location.replace(url.toString());
  }

  callback(token: string) {
    this.token = token;
    this.user = fromPairs(Array.from(new URLSearchParams(Buffer.from(token, 'base64').toString())));
    localStorage.setItem('login', token);
  }

  avatar(username) {
    return 'https://ygobbs.com/user_avatar/ygobbs.com/' + username + '/25/1.png';
  }

}
