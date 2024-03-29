/**
 * @description: 表格公用 loading、pagination、search
 * @author: cnn
 * @createTime: 2020/9/11 13:12
 **/
import React, { useState } from 'react';
import { useHistory } from 'react-router';
// import './Table.less';
import { IPageSession } from '@utils/CommonVars';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface Sorter {
  field: string,
  order: 'orderByDesc' | 'orderByASC'
}

export const paginationInit = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => {
    return `共查询到 ${total} 条数据`;
  },
  showSizeChanger: true
};

interface ITableHookProps {
  isBackSearchProp?: boolean; // 是否是需要做返回操作的页面
  pageSize?: number; // 每页条数
  tableSize?: 'small' | 'default' | 'large'; // 表格大小
  bordered?: boolean; // 是否显示表格
  hidePage?: boolean; // 是否隐藏分页
  sessionName?: IPageSession; // sessionStorage里面current的命名，如果页面中有多个表格，使用sessionName区分current
  showSticky?: boolean; // 是否显示超长后显示滚动条
  totalRender?: any; // 自定义显示表格分页的total
  headerResizable?: boolean; // 表头是否可伸缩
  resizeByKey?: boolean; // 根据column width来伸缩列, 为true，则需设置setHeaderWidth和headerWidth,为false则需设置setColumns和columns
  setColumns?: (columns: any) => void;
  columns?: Array<any>;
  setHeaderWidth?: (widthMap: any) => void;
  headerWidth?: any;
}
const useTableHook = (props: ITableHookProps = {}) => {
  const history = useHistory();
  const {
    isBackSearchProp, pageSize, tableSize, bordered, hidePage, sessionName, showSticky = false, totalRender,
    headerResizable = false, setColumns, columns,
    resizeByKey, setHeaderWidth, headerWidth
  } = props;
  const sessionCurrent = sessionName ? sessionName : '';
  const { state }: any = history.location;
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<any>(() => {
    // 如果不是要返回的页面才赋值
    if (!isBackSearchProp) {
      // 如果是页面返回的，则赋值
      if (state && state.searchContent) {
        return state.searchContent;
      } else {
        return undefined;
      }
    }
  });
  const [pagination, setPagination] = useState(() => {
    let tempPagination: any = {
      current: 1,
      pageSize: pageSize || 10,
      total: 0,
      showTotal(total:number): React.ReactNode {
        if (totalRender) {
          return totalRender(total);
        } else {
          return `共查询到 ${total} 条数据`;
        }
      }
    };
    if (!isBackSearchProp) {
      let current: number = 1;
      if (sessionStorage.getItem('current' + sessionCurrent)) {
        // @ts-ignore
        current = parseInt(sessionStorage.getItem('current' + sessionCurrent), 10);
      }
      // 如果是页面返回的，则赋值
      if (state && state.current) {
        current = state.current;
      }
      tempPagination.current = current;
    }
    return tempPagination;
  });
  const [sorter, setSorter] = useState<Sorter>({
    field: '',
    order: 'orderByDesc'
  });
  const [isBackSearch, setIsBackSearch] = useState<boolean>(isBackSearchProp || false);
  // 监听表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (extra.action === 'paginate') {
      pagination.showTotal = (total: number) => {
        if (totalRender) {
          return totalRender(total);
        } else {
          return `共查询到 ${total} 条数据`;
        }
      };
      sessionStorage.setItem('current' + sessionCurrent, pagination.current);
      setPagination(pagination);
    } else if (extra.action === 'sort') {
      setSorter({
        field: sorter.field,
        order: sorter.order === 'ascend' ? 'orderByASC' : 'orderByDesc'
      });
    }
  };
  // 搜索
  const handleSearch = (content: any) => {
    pagination.current = 1;
    setPagination(pagination);
    setSearchContent(content);
  };
  /**
   * @description 删除中调用该方法，解决：删除最后一页最后一条数据或删除多条数据后当前页没有数据展示，table表展示空页面 bug
   * @param lastPageRows 删除前的数组长度
   * @param deleteLength 被删除的数组长度
   */
  const backFrontPage = (lastPageRows: number, deleteLength?: number) => {
    // 如果当前页是最后一页，且最后一页被删以后没有数据了，则修改 pagination 为上一页
    let frontFlag = lastPageRows === 1 || (deleteLength && (lastPageRows - deleteLength === 0));
    if (pagination.current === Math.ceil(pagination.total / pagination.pageSize) && frontFlag && pagination.current > 1) {
      pagination.current = pagination.current - 1;
      sessionStorage.setItem('current' + sessionCurrent, String(pagination.current));
    }
    setPagination({ ...pagination });
  };
  // 获取表格的样式
  const getRowClass = (record: any, index: number) => (index % 2 ? 'table-single' : '');
  const handleResize =
    (index: number | string) =>
      (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        if (resizeByKey) {
          setHeaderWidth && setHeaderWidth({ ...headerWidth, [index]: size.width })
        } else {
          const newColumns = columns ? [...columns] : [];
          newColumns[index] = {
            ...newColumns[index],
            width: size.width,
          };
          setColumns && setColumns(newColumns);
        }
      };
  let tableParam: any =  {
    size: tableSize || 'default',
    loading: loading,
    bordered: bordered || true,
    pagination: hidePage ? false : pagination,
    onChange: handleTableChange,
    rowClassName: getRowClass,
    rowKey: 'id',
    components: headerResizable && {
      header: {
        cell: ResizableTitle,
      },
    }
  };
  if (showSticky) {
    tableParam = {
      ...tableParam,
      scroll: { x: 1200 },
      sticky: {
        getContainer: () => document.getElementById('content') || window
      }
    };
  }
  return {
    loading, setLoading, pagination, setPagination, searchContent, handleTableChange,
    handleSearch, backFrontPage, sorter, isBackSearch, setIsBackSearch, getRowClass, tableParam,
    handleResize
  };
};
const ResizableTitle = (
  props: React.HTMLAttributes<any> & {
    onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
    width: number;
  },
) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
export default useTableHook;
