import { Injectable } from '@angular/core';
//import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result: any;
  apiMasterIp = '10.10.10.10'

  constructor(private http: HttpClient) { }

  getServerList() {
    return this.http.get('http://' + this.apiMasterIp + ':3000/api/servers')
      .map(result => this.result = result);
  }

  addServer(newServer) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.apiMasterIp + ':3000/api/server', newServer, { headers: headers });
  }

  deleteServer(id) {
    return this.http.delete('http://' + this.apiMasterIp + ':3000/api/server/' + id);
  }

  updateServer(newServer) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://' + this.apiMasterIp + ':3000/api/server/' + newServer._id, newServer, { headers: headers });
  }

  getKubeNodeList(kubeMasterIp) {
    return this.http.get('http://' + kubeMasterIp + ':8080/api/v1/nodes');
  }

  getKubePodList(kubeMasterIp) {
    return this.http.get('http://' + kubeMasterIp + ':8080/api/v1/pods');
  }

  getKubeNodeDetail(kubeMasterIp, kubeNodeApiAddr) {
    return this.http.get('http://' + kubeMasterIp + ':8080' + kubeNodeApiAddr);
  }

  deleteNode(kubeMasterIp, nodeID) {
    //curl -X DELETE http://localhost:8080//api/v1/nodes/coreos1
    return this.http.delete('http://' + kubeMasterIp + ':8080/api/v1/nodes/' + nodeID);
  }

  deletePod(kubeMasterIp, podID) {
    //curl -X DELETE http://localhost:8080/api/v1/namespaces/default/pods/alpine
    return this.http.delete('http://' + kubeMasterIp + ':8080/api/v1/namespaces/default/pods/' + podID);
  }

}
