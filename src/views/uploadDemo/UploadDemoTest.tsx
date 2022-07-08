/**
 *@description
 *@author cy
 *@date 2022-07-08 10:42
 **/
import React, { useState } from 'react';
import { Card, Form, Row, Col, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MyUpload from '@views/upload/MyUpload';
import { fileAccept } from '@utils/CommonVars';

const UploadDemoTest = () => {
  const [textList, setTextList] = useState<Array<any>>([]);
  const [imgList, setImgList] = useState<Array<any>>([]);
  const [directory, setDirectory] = useState<any>(0);
  const [showType, setShowType] = useState<any>('length');
  const onTextChange = (fileList: Array<any>) => {
    setTextList(fileList);
  };
  return (
    <Card title="普通上传文件模板">
      <Row>
        <Col span={12}>
          <Form labelCol={{ span: 8 }}>
            <Form.Item label="是否选择文件夹">
              <Radio.Group options={[{ label: '是', value: 1 }, { label: '否', value: 0 }]} onChange={(e: any) => setDirectory(e.target.value)} />
            </Form.Item>
            <Form.Item label="上传显示类型">
              <Radio.Group
                options={[{ label: 'Text', value: 'text' }, { label: 'Length', value: 'length' }]}
                onChange={(e: any) => setShowType(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="上传文件">
              <MyUpload
                onChange={onTextChange}
                showFileList={textList}
                directory={directory === 1}
                listType={showType}
              />
            </Form.Item>
            <Form.Item label="图片显示缩略图">
              <MyUpload
                onChange={(fileList: Array<any>) => setImgList(fileList)}
                showFileList={imgList}
                maxCount={10}
                accept={fileAccept.img}
                multiple={true}
                listType="picture"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </MyUpload>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default UploadDemoTest;