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

import { AxiosResponse } from 'axios'
import { HttpClient, RequestParams } from './http-client'

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags api
   * @name GetList
   * @summary 获得swagger resources
   * @request GET:/swagger-resources
   * @secure
   */
  getSwaggerResources = (params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/swagger-resources`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags api
   * @name GetList
   * @summary 获得swagger json
   * @request GET:/swagger-resources
   * @secure
   */
  getSwaggerJson = (path: string, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: path,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
}
