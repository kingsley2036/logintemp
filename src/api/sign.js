import {requireContext} from '@/api/context'

/**
 * SHA1 加密
 * @type {number}
 */
export const SHA1Digest = function() {
  const f = [
    (m) => m[1] & m[2] | ~m[1] & m[3],
    (m) => m[1] ^ m[2] ^ m[3],
    (m) => m[1] & m[2] | m[1] & m[3] | m[2] & m[3],
    (m) => m[1] ^ m[2] ^ m[3]
  ], rol = (n, c) => n << c | n >>> (32 - c);

  function _sha1(bytes) {
    let data = new Uint8Array(bytes);
    let i, j, t,
      k = [1518500249, 1859775393, -1894007588, -899497514],
      m = [1732584193, -271733879, null, null, -1009589776];
    let l = ((data.length + 8) >>> 6 << 4) + 16, s0 = new Uint8Array(l << 2);
    s0.set(new Uint8Array(data.buffer));
    let s = new Uint32Array(s0.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    let w = [];
    m[2] = ~m[0];
    m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
      let o = m.slice(0);
      for (j = 0; j < 80; j++) {
        w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        t = rol(m[0], 5) + f[j / 20 | 0](m) + m[4] + w[j] + k[j / 20 | 0] | 0;
        m[1] = rol(m[1], 30);
        m.pop();
        m.unshift(t);
      }
      for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    }
    t = new DataView(new Uint32Array(m).buffer);
    for (i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);
    return m;
  }

  let bytes = [];

  /**
   * 添加输入字节数组
   */
  this.update = function(binaryArray) {
    bytes = bytes.concat(binaryArray);
  };

  /**
   * 求SHA1
   *
   * @param binaryArray 輸入數組
   * @returns {Array}
   */
  this.digest = function(binaryArray) {
    binaryArray && this.update(binaryArray);
    return Array.from(new Uint8Array(new Uint32Array(_sha1(bytes)).buffer));
  };

  /**
   * 重置輸入
   */
  this.reset = function() {
    bytes = [];
  };
};

/**
 * 字符串转换为字节数组
 */
export const strBytes = function (s) {
  let i, r = [], c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) {
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000;
        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      } else {
        r.push(0xE0 + (c >> 12 & 0xF));
      }
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    }
  return r;
};

/**
 * 数值数组转换为Hex格式字符串
 */
export const toHex = function (m, w = 2) {
  let mapper = e => {
    let hex = e.toString(16), d = w - hex.length;
    return (d > 0) ? "0".repeat(d) + hex : hex;
  };
  return m.map(mapper).join("");
};

/**
 * 16进制转字节数组
 * @param {String} s 
 */
export const parseHex = function(s) {
  let bytes = [];
  for (let i = 0; i < s.length; i++) {
    bytes.push(parseInt(s.substr(i++, 2), 16));
  }
  return bytes;
};

/**
 * 兼容 Jeeplus 密码加密
 * @param {String} password 
 * @param {String} salt 
 */
export function jeeplusDigest(password, salt) {
  const bytes = strBytes(password), saltBytes = parseHex(salt), digest = new SHA1Digest();
  digest.update(saltBytes);

  let result = digest.digest(bytes);

  for (let i = 1; i < 1024; i++) {
    digest.reset();
    result = digest.digest(result)
  }
  return toHex(saltBytes) + toHex(result);
}

export function buildSign({token, sc} = {}) {
	if (token && sc) {
		let timeStr = new Date().format("yyyyMMddhhmmss");
		let bytes = strBytes(timeStr + sc + token)
		return timeStr + toHex(new SHA1Digest().digest(bytes));
	}
}

export function buildUrlSign(url) {
  /* global $c */
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + `token=${$c.login.token}&sign=${buildSign($c.login)}`
}
