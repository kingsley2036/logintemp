/*
 * 全局配置
 */

// const HOST = 'localhost:8084';
const HOST = '123.58.240.194:9005';
// const HOST = 'fume.ttantu.cn:8001';
const RES_HOST = 'fume.ttantu.cn';
const PATH = 'lampblack-service';

const basePath = `http://${HOST}/${PATH}`;
const baseRes = `http://${RES_HOST}/${PATH}`;
const baseSocket = `ws://${HOST}/${PATH}`

const DEFAULT_MAP_CENTER = [117.196015,34.285337]
// const DEFAULT_MAP_CENTER = [116.5953946, 34.6939157]
const _MAP_CENTERS = {
  '丰县': [116.6253946, 34.6939157],
  // '丰县': [116.5953946, 34.6939157],
  '鼓楼区': [117.196015, 34.285337],
}

const resolveCenter = (key) => _MAP_CENTERS[key] || DEFAULT_MAP_CENTER