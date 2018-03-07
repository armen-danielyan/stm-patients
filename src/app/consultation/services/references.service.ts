import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from '../../shared/services/cognito.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class ReferencesService {

  private baseUrl: string = environment.api.url;
  headers;
  headers_post;
  checked_doctor_rank;

  constructor(private http: HttpClient, private cUtil: CognitoUtil) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
      this.headers_post = new HttpHeaders()
        .set('Authorization', session.getIdToken().getJwtToken());
    });
  }

  //get proffessions list
  getSpecialities(id) {
    return this.http.get(`${this.baseUrl}/patient/core/reference/specialty?specialization_id=` + id, { headers: this.headers });
  }

  //get ranks list
  getRanks() {
    return this.http.get(`${this.baseUrl}/patient/core/reference/rank`, { headers: this.headers });
  }

  //submit data consultation component
  submitData(data) {
    return this.http.post(`${this.baseUrl}/patient/core/request`, data, { headers: this.headers_post });
  }

  //get complaint-subjects(feedback form component)
  getComplaintSubjects() {
    return this.http.get(`${this.baseUrl}/patient/core/reference/complaint-subject`, { headers: this.headers });
  }

  //pacient gets appointment_id after waiting-time for call
  getAppointmentId(id) {
    // id = 114;
    return this.http.get(`${this.baseUrl}/patient/core/request/` + id, { headers: this.headers });
  }

  //patient joins to appointment
  joinAppointment(appointment_id) {
    return this.http.get(`${this.baseUrl}/patient/core/appointment/${appointment_id}/join`, { headers: this.headers });
  }

  //delete request when is not free doctor
  deleteAppointment(appointment_id) {
    return this.http.delete(`${this.baseUrl}/patient/core/request/${appointment_id}`, { headers: this.headers });
  }

  //get info about appointement
  getInfoAppointment(appointment_id) {
    return this.http.get(`${this.baseUrl}/patient/core/appointment/${appointment_id}`, { headers: this.headers });
  }

  //patient finished appointment
  finishAppointment(appointment_id) {
    return this.http.get(`${this.baseUrl}/patient/core/appointment/${appointment_id}/finish`, { headers: this.headers });
  }
}
