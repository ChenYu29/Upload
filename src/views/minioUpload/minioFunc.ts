/**
 *@description
 *@author cy
 *@date 2022-07-11 13:10
 **/

// const Minio = require('minio');
import MinIO, { Client } from 'minio';

export class MinioFunc {
  private readonly minioClient: MinIO.Client;
  // private minioClient;
  constructor() {
    this.minioClient = new Client({
      endPoint: '192.168.3.251',
      port: 9090,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin'
    });
  };
  public getMinioClient () {
    return this.minioClient;
  }
}