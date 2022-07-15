/**
 *@description minio 上传demo
 *@author cy
 *@date 2022-07-11 10:43
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Card, Form } from 'antd';
import MyUpload from '@views/upload/MyUpload';
import { MinioFunc } from '@views/minioUpload/minioFunc';
import { CopyDestinationOptions, CopySourceOptions, Client } from 'minio';
// import Helpers from '../../../node_modules/minio/dist/main/helpers';
import * as Fs from 'fs';
import { put } from '@utils/Ajax';
import dayjs from 'dayjs';
import dayJs from 'dayjs';

let minio: Client;
const MinIOConfig: {
  bucket: string
} = {
  bucket: 'uploadtest'
}
const MinioUploadDemo = () => {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [upList, setUpList] = useState<Array<any>>([]);
  const upSourceRef = useRef<Array<any>>([]);
  useEffect(() => {
    if (!minio) {
      minio = new MinioFunc().getMinioClient();
      console.log('minio', minio);
    }
  }, []);
  useEffect(() => {
    if (upList.length > 0) {
      let total = upList[0].total;
      let done = upList.filter((item: any) => item.status === 'done').sort((a: any, b: any) => a.index - b.index);
      console.log('done', done);
      if (done.length === total) {
        let buffArr = done.map((item: any) => new Buffer.from(item.buff));
        // todo buffer超过int的最大值，上传失败
        let newBuff = new Buffer.concat(buffArr);
        console.log('newBuff', newBuff);
        let name = dayJs().format('YYYY-MM-DD') + '/测试22.tif';
        minio.putObject(MinIOConfig.bucket, name, newBuff, (res: any) => {
          console.log('res', res)
        });
        // todo 分片上传后合并找不到CopySourceOptions为一个构造方法，上传失败
        // let arr = done.map((item: any) => {
        //   return new Helpers.CopySourceOptions({
        //     Bucket: MinIOConfig.bucket,
        //     Object: item.name
        //   })
        // })
        // let dest = { Bucket: MinIOConfig.bucket, Object: '测试11.tif' };
        // // new CopyDestinationOptions({ Bucket: MinIOConfig.bucket, Object: '测试11.tif' })
        // minio.composeObject(dest, arr).then((call: any) => {
        //   console.log('compose', call);
        // })
      }
    }
  }, [upList]);
  const onFileChange = (list: Array<any>) => {
    console.log('list', list);
    list.map((item: any) => {
      let chunkSize = Math.ceil(item.size / 1024 / 1024 / 20);
      console.log('chunkSize', chunkSize);
      let time = dayjs().valueOf();
      let fileObj = [];
      for (let i = 0; i < chunkSize; i++) {
        let name = time + '/' + i;
        fileObj.push({
          name,
          index: i,
          status: 'upload',
          file: item.slice(i * 1024 * 1024 * 20, (i + 1) * 1024 * 1024 * 20 + 1),
          total: chunkSize
        });
      }
      fileObj.map((item: any) => {
        let buf: FileReader = new FileReader();
        // let arrs = item.arrayBuffer();
        // console.log('arr', arrs);
        // buf.readAsDataURL(item);

        buf.readAsArrayBuffer(item.file);
        buf.onload = (e: any) => {
          console.log('onload', e);
          upSourceRef.current.push({ ...item, status: 'done', buff: e.target.result });
          setUpList([...upSourceRef.current]);
          // let result = Buffer.from(e.target.result);
          // minio.putObject(MinIOConfig.bucket, item.name, result, (res: any) => {
          //   console.log('res', res)
          // });
        };
        buf.onabort = (e: any) => {
          console.log('abort', e);
        };
        buf.onerror = (e: any) => {
          console.log('error', e);
        };
      });
      // 获取分片上传的url，再上传完成后合并
      // fileObj.map((item: any) => {
      //   minio.presignedPutObject(MinIOConfig.bucket, item.name, 60 * 60, (err: any, call: any) => {
      //     let reader: FileReader = new FileReader();
      //     let partFile = item.file;
      //     // console.log('partFile', partFile);
      //     put(call, partFile, {}, (data: any) => {
      //       upSourceRef.current.push({ ...item, status: 'done' });
      //       console.log('upSourceRef.current', upSourceRef.current);
      //       setUpList([...upSourceRef.current]);
      //     });
      //   });
      // });
      // let buf: FileReader = new FileReader();
      // let arrs = item.arrayBuffer();
      // console.log('arr', arrs);
      // buf.readAsDataURL(item);
      //
      // // buf.readAsArrayBuffer(item);
      // buf.onload = (e: any) => {
      //   console.log('onload', e);
      //   // let result = Buffer.from(e.target.result);
      //   // minio.putObject(MinIOConfig.bucket, item.name, result, (res: any) => {
      //   //   console.log('res', res)
      //   // });
      // };
      // buf.onabort = (e: any) => {
      //   console.log('abort', e);
      // };
      // buf.onerror = (e: any) => {
      //   console.log('error', e);
      // };
      // minio.putObject(MinIOConfig.bucket, item.name, buf, (res: any) => {
      //   console.log('res', res)
      // });
    });
  };
  return (
    <Card title="上传到Minio示例">
      <Form>
        <Form.Item label="选择文件">
          <MyUpload
            onChange={onFileChange}
            showFileList={fileList}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};
export default MinioUploadDemo;