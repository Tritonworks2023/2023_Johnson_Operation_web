import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-joininspection-job-details',
  templateUrl: './joininspection-job-details.component.html',
  styleUrls: ['./joininspection-job-details.component.css']
})
export class JoininspectionJobDetailsComponent implements OnInit {

 
  loader_view = false;

  final_datas = [];
  getSpecInfo:any[] = [];
  eachSpecData:any;

  job_count = 0; 
  job_detail : any;

  job_list_detail : any;
 table_data : any;

 timeLeft: number = 2;
 interval;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
  ) {


    var datas = this.storage.get('joint_inspection_detail');
    console.log(datas);
    this.job_detail = datas;


   }

  ngOnInit(): void {
    let job_id = {
      job_id :  this.job_detail.job_id,
      group_id : this.job_detail.group_id,
      sub_group_id : this.job_detail.sub_group_id._id
    }
    console.log(job_id);
    this._api.Joint_inspection_jobdetail_fetch_by_id(job_id).subscribe(
     (response: any) => {
        this.loader_view = true;
        console.log("response.Data");
        console.log(response.Data);
        this.job_list_detail = response.Data;
        
        this.job_list_detail.forEach(elements => {
        let count_value = 0;
        elements.data_store.forEach(element => {
          element.count_value = count_value + 1;
          count_value = count_value + 1 ;
        });
        console.log(count_value)
      });
      
        this.job_count = (this.job_list_detail.length / 2) - 1;
        this.table_data =  this.job_list_detail[0].data_store;
        // this.getSpecInfo = this.job_list_detail[0].getSpecInfo;
        this.eachSpecData  = this.job_list_detail[0].getSpecInfo[0];
        console.log('*****Data*********',this.job_list_detail);
        this.startTimer2();
      }
    );
  }


  recall(index,count){
    // console.log(index,count);
    if(index < this.job_list_detail.length){ 
     var check_value_data = this.job_list_detail[0].data_store;
     var value_data = this.job_list_detail[index].data_store; 
     for(let a = 0; a < check_value_data.length ; a++) {
          var temp_data = value_data;
          var check_status = 0;
          for(let b = 0 ; b < temp_data.length; b++){
                if(check_value_data[a]._id == temp_data[b]._id){
                  this.job_list_detail[index].data_store[b].count_value = check_value_data[a].count_value;
                  check_status = 1;
                }
                if(b == temp_data.length - 1){
                  if(check_status == 0){
                    this.job_list_detail[index].data_store.push(check_value_data[a])
                  }
                }
          }
          if(a == check_value_data.length - 1){
            this.job_list_detail[index].data_store = this.job_list_detail[index].data_store.sort((a, b) => a.count_value > b.count_value ? 1 : -1);
            index = index + 1;
            this.recall(index,count);
          }
     }
    } else {
      this.loader_view = false;
    
    }


  }


  startTimer2() {
  this.interval = setInterval(() => {
    console.log(this.timeLeft);
    if(this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.recall(1,0);
      this.pauseTimer();
    }
  },1000)
}

pauseTimer() {
  clearInterval(this.interval);
}


print_pdf(){
  this.storage.set('joint_pdf_detail',this.job_list_detail);
  this.router.navigateByUrl('/admin/joininspection_details_pdf');
}











      




}

// {
//   "_id": "66ed22a1dd06006b12d3ce6e",
//   "userId": "66de6917c8faef2163e3df26",
//   "activityId": "",
//   "jobId": "E-A1379",
//   "groupId": "6666c5879fc63187b73b9509",
//   "customerName": "SRM INSTITUTE OF SCIENCE & TECHNOLOGY",
//   "verticalRise": "4000 MM",
//   "capacity": "6000/H",
//   "angleOfInclination": "35 Degree",
//   "ratedSpeed": "0.50 M/s",
//   "stepWidth": "1000 MM",
//   "flatSteps": "TWO",
//   "installedBy": "Sri Venkateshwara Technical works ",
//   "testedBy": "Sharabhoji ",
//   "routeEngineer": "elumalai ",
//   "zonalEngineer": "janavel ",
//   "operationHead": "ayubkhan ",
//   "serviceHead": "osia ",
//   "serviceRecordDate": "21.09.24",
//   "motorMakeType": "YFD132M-4",
//   "motorSlNo": "2405H186",
//   "motorKW": "7.5 KW",
//   "motorVoltage": "415",
//   "motorCurrent": "13.5",
//   "motorRPM": "1440",
//   "gearBoxMakeType": "FJ125",
//   "gearBoxSlNo": "24119169",
//   "gearBoxOilGrade": "BJ460",
//   "gearBoxOilCapacity": "7 liter ",
//   "brakeMakeType": "BRA450",
//   "brakeSlNo": "24051125",
//   "brakeTravel": "450mm",
//   "brakeVoltage": "240 VAC",
//   "brakeCurrent": "0.68A",
//   "controllerType": "E-CON",
//   "controllerSlNo": "24J08093",
//   "starDelta": "VVVF (Inverter)",
//   "makeSlNo": "G1000-4T0025AJ",
//   "v3fCapacity": "11KW",
//   "contactorsMake": "Schneider ",
//   "contactorsRating": "32A",
//   "amps": "32A",
//   "wiringDiagramNo": "24J08093",
//   "plcMicroProcesser": "Microprocessor ",
//   "plcMakeType": "NA",
//   "transformerMakeType": "SEC/150VA FREQUENCY 50/60HZ",
//   "trfVACapacity": "150VA",
//   "voltageIP": "110V",
//   "voltageOP": "240V",
//   "createdAt": "2024-09-20T07:22:09.913Z",
//   "updatedAt": "2024-09-20T07:22:09.913Z",
//   "__v": 0
// }