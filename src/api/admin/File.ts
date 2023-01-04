/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { PageInputFileGetPageDto, ResultOutputPageOutputFileGetPageOutput } from './data-contracts'
import { ContentType, HttpClient, RequestParams } from './http-client'

export class File<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags file
   * @name GetPage
   * @summary 查询文件列表
   * @request POST:/api/admin/file/get-page
   * @secure
   */
  getPage = (data: PageInputFileGetPageDto, params: RequestParams = {}) =>
    this.request<ResultOutputPageOutputFileGetPageOutput, any>({
      path: `/api/admin/file/get-page`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
