/**
 * @description: 公共接口
 * @author: cy
 * @createTime: 2022/7/8 9:30
 **/
/**
 * 基础实体
 * **/
export interface IBaseEntity {
  id: string,
  name: string,
  code?: string
}
/**
 * 菜单
 * **/
export interface IMenuData extends IBaseEntity {
  icon: string,
  url: string,
  menuType: number,
  children?: Array<IMenuData>
}
/**
 * 选项
 * **/
export interface IOptionData {
  key: string,
  value: string
}
