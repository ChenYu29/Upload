/**
 *@description 可伸缩列表格
 *@author cy
 *@date 2022-10-08 09:34
 **/
import React, { useState } from 'react';
import { Card, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import './table.less';
import useTableHook from './useTableHook';

const ResizeTable = () => {
  // const [columns, setColumns] = useState<ColumnsType<any>>([
  //   { title: 'Date', dataIndex: 'date', width: 200 },
  //   { title: 'Amount', dataIndex: 'amount', width: 100, sorter: (a, b) => a.amount - b.amount },
  //   { title: 'Type', dataIndex: 'type', width: 200 },
  //   { title: 'Note', dataIndex: 'note', width: 100 }
  // ]);
  // const { tableParam, handleResize } = useTableHook({ headerResizable: true, columns, setColumns });
  // const mergeColumns: ColumnsType<any> = columns.map((col, index) => ({
  //   ...col,
  //   onHeaderCell: column => ({
  //     width: (column as ColumnType<any>).width,
  //     onResize: handleResize(index),
  //   }),
  // }));
  const [headerWidth, setHeaderWidth] = useState<any>({ date: 200, amount: 200, type: 150, note: 100, age: 50, sex: 50 });
  const { tableParam, handleResize } = useTableHook({ headerResizable: true, resizeByKey: true, headerWidth, setHeaderWidth });
  const columns2 = [
    { title: 'Date', children: [
        { title: '人', dataIndex: 'age', width: headerWidth.age },
        { title: 'sex', dataIndex: 'sex', width: headerWidth.sex },
      ] },
    { title: 'Amount', dataIndex: 'amount', width: headerWidth.amount, sorter: (a, b) => a.amount - b.amount },
    { title: 'Type', dataIndex: 'type', width: headerWidth.type },
    { title: 'Note', dataIndex: 'note', width: headerWidth.note }
  ];
  const renderColumns = (arr: Array<any>) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        ...arr[i],
        onHeaderCell: column => {
          return {
            width: (column as ColumnType<any>).width,
            onResize: handleResize(column.dataIndex),
          }
        }
      }
    }
  };
  const mergeColumns: ColumnsType<any> = columns2.map((col) => ({
    ...col,
    onHeaderCell: column => {
      return {
        width: (column as ColumnType<any>).width,
        onResize: handleResize(column.dataIndex),
      }
    },
  }));
  const data = [
    {
      key: 0,
      date: '2018-02-11',
      amount: 120,
      type: 'income',
      note: 'transfer', age: 1, sex: 2
    },
    {
      key: 1,
      date: '2018-03-11',
      amount: 243,
      type: 'income',
      note: 'transfer', age: 1, sex: 2
    },
    {
      key: 2,
      date: '2018-04-11',
      amount: 98,
      type: 'income',
      note: 'transfer', age: 1, sex: 2
    },
  ]
  return (
    <Card title="可伸缩列表格">
      <Table
        {...tableParam}
        bordered
        columns={mergeColumns}
        dataSource={data}
      />
    </Card>
  );
};
export default ResizeTable;