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

import {
  PageInputFileGetPageDto,
  ResultOutputFileEntity,
  ResultOutputListFileEntity,
  ResultOutputPageOutputFileGetPageOutput,
} from './data-contracts'
import { ContentType, HttpClient, RequestParams } from './http-client'

export class FileApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
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
  /**
   * No description
   *
   * @tags file
   * @name UploadFile
   * @summary 上传文件
   * @request POST:/api/admin/file/upload-file
   * @secure
   */
  uploadFile = (
    data: {
      /** @format binary */
      file: File
    },
    query?: {
      /** @default "" */
      fileDirectory?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultOutputFileEntity, any>({
      path: `/api/admin/file/upload-file`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags file
   * @name UploadFiles
   * @summary 上传多文件
   * @request POST:/api/admin/file/upload-files
   * @secure
   */
  uploadFiles = (
    data: {
      files: File[]
    },
    query?: {
      /** @default "" */
      fileDirectory?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultOutputListFileEntity, any>({
      path: `/api/admin/file/upload-files`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    })
}
