/**
 *@description minio 上传demo
 *@author cy
 *@date 2022-07-11 10:43
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Upload, Button } from 'antd';
import MyUpload from '@views/upload/MyUpload';
import { MinioFunc } from '@views/minioUpload/minioFunc';
import { Client } from 'minio';
// import Helpers from '../../../node_modules/minio/dist/main/helpers';
import * as Fs from 'fs';
import { post, put } from '@utils/Ajax';
import dayjs from 'dayjs';
import SparkMD5 from 'spark-md5';
import { LimitRequest } from '@views/minioUpload/LimitAjax';
import { analyzeScope } from '@typescript-eslint/parser/dist/analyze-scope';

let minio: Client;
const MinIOConfig: {
  bucket: string
} = {
  bucket: 'uploadtest'
}
const chunkSize = 5 * 1024 * 1024;
const MinioPartUploadDemo = () => {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [upList, setUpList] = useState<Array<any>>([]);
  const upSourceRef = useRef<Array<any>>([]);
  useEffect(() => {
    if (!minio) {
      minio = new MinioFunc().getMinioClient();
    }
  }, []);
  useEffect(() => {
    if (upList.length > 0) {
    }
  }, [upList]);
  /**
   * 获取文件MD5
   * @param file
   * @returns {Promise<unknown>}
   */
  const getFileMd5 = async (file: any) => {
    let fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    let spark = new SparkMD5()
    return new Promise((resolve) => {
      fileReader.onload = (e) => {
        spark.appendBinary(e.target.result)
        resolve(spark.end())
      }
    })
  }
  /**
   * 请求后端合并文件
   * @param fileMd5
   * @param fileName
   */
  const composeFile = (uploadId: any, fileName: any, chunkSize: any, fileSize: any, contentType: any) => {
    console.log("开始请求后端合并文件")
    //注意：bucketName请填写你自己的存储桶名称，如果没有，就先创建一个写在这
    const composeParams = {
      uploadId: uploadId,
      fileName: fileName,
      chunkSize: chunkSize,
      fileSize: fileSize
    };
    post('biz/importRecord/completePart', composeParams, { dataType: 'json' }, (res: any) => {
      console.log("合并文件完成",res.data)
      // videoPlay(res.data.filePath,res.data.suffix)
    })
  }
  const onFileChange = (list: Array<any>) => {
    let limit = new LimitRequest(5);
    list.map((file: any, index: number) => {
      //文件大小(大于5m再分片哦，否则直接走普通文件上传的逻辑就可以了，这里只实现分片上传逻辑)
      const fileSize = file.size

      if (fileSize <= chunkSize){
        limit.request(() => {
          // setTimeout(() => {
          //   console.log("第" + index + "个分片上传完成");
          //   // resolve(true);
          // }, 3000);
          return new Promise((resolve: any) => {
            // setTimeout(() => {
            //   console.log("第" + index + "个分片上传完成");
            //   resolve(true);
            // }, 3000);
            let url = 'http://192.168.3.251:9090/uploadtest/1020/' + file.name;
            put(url, file, {}, (res: any) => {
              console.log("第" + index + "个分片上传完成");
              resolve(true);
            })
          })
        });
      }

      //计算当前选择文件需要的分片数量
      const chunkCount = Math.ceil(fileSize / chunkSize)
      console.log("文件大小：",(file.size / 1024 / 1024) + "Mb","分片数：",chunkCount)

      //获取文件md5
      const fileMd5 = getFileMd5(file);
      console.log("文件md5：",fileMd5)

      console.log("向后端请求本次分片上传初始化")
      //向后端请求本次分片上传初始化
      const initUploadParams = JSON.stringify({chunkSize: chunkCount,fileName: file.name})
      post('biz/importRecord/createPart', initUploadParams, { headers: { 'Content-type': 'application/json' }}, (res: any) => {
        //code = 0 文件在之前已经上传完成，直接走秒传逻辑；code = 1 文件上传过，但未完成，走续传逻辑;code = 200 则仅需要合并文件
        if (res.code === 200) {
          console.log("当前文件上传情况：所有分片已在之前上传完成，仅需合并")
          composeFile(res.data.uploadId,file.name, chunkCount, fileSize, file.contentType)
          return;
        }
        if (res.code === 0) {
          console.log("当前文件上传情况：秒传")
          return
        }
        console.log("当前文件上传情况：初次上传 或 断点续传")
        const chunkUploadUrls = res.data.chunks

        //当前为顺序上传方式，若要测试并发上传，请将第52行 await 修饰符删除即可
        //若使用并发上传方式，当前分片上传完成后打印出来的完成提示是不准确的，但这并不影响最终运行结果；原因是由ajax请求本身是异步导致的
        let doneNum = 0;
        for (let item of chunkUploadUrls) {
          //分片开始位置
          let start = (item.partNumber) * chunkSize
          //分片结束位置
          let end = Math.min(fileSize, start + chunkSize)
          //取文件指定范围内的byte，从而得到分片数据
          let _chunkFile = file.slice(start, end)
          console.log("开始上传第" + item.partNumber + "个分片");
          limit.request(() => {
            return new Promise((resolve: any) => {
              put(item.uploadUrl, _chunkFile, {}, (respart: any) => {
                console.log("第" + item.partNumber + "个分片上传完成");
                ++doneNum;
                if (doneNum === chunkUploadUrls.length) {
                  composeFile(res.data.uploadId,file.name, chunkCount, fileSize, file.contentType)
                }
                resolve(true);
              });
            });
          })
        }
      });
    });
  };
  const props: any = {
    name: 'file',
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    beforeUpload: file => {
      file.status = 'uploading';
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    onChange(info) {
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
  };
  return (
    <Card title="分片上传到Minio示例">
      <Form>
        <Form.Item label="选择文件">
          <Upload {...props}>
            <Button>Click to Upload</Button>
          </Upload>
          {/*<MyUpload*/}
          {/*  onChange={onFileChange}*/}
          {/*  showFileList={fileList}*/}
          {/*  listType="text"*/}
          {/*  multiple={true}*/}
          {/*  maxCount={500}*/}
          {/*/>*/}
        </Form.Item>
      </Form>
    </Card>
  );
};
export default MinioPartUploadDemo;