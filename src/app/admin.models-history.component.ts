import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import {CookieManager, SystemInfo} from './supporting';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-models-history',
    styles: [`
      .data-header {
        text-align: center;
        margin-bottom: 25px;
        margin-top: 40px;
      }
      .history-div {
        width: 1500px;
     
        padding-top: 20px;
        margin-left: 460px;
        border-radius: 23px;
      }
      .info-button {
        margin-left: 420px;
        width: 140px;
        border-radius: 6px;
      }
      .data-index {
        position: absolute;
    
      }
      .params {
        margin-bottom: 10px;
        text-align: left;
      }
    `],
    template: `<h5 class="data-header">История обучения моделей</h5>
    <div class="history-div">
      <ul>
        <li *ngFor="let model of models; index as i">
          <span class="data-index">{{model.display_name}} {{model.date}} (score {{model.test_f_score}})</span>
          <button class="info-button" (click)="info(model)">Подробнее</button>
          <div class="params" *ngIf="model.isshown">
            <div *ngFor="let param of model | keyvalue">
              <div *ngIf="param.key!='isshown' && param.key!='model_type_id' && param.key!='id' && param.key!='parameters' && param.key!='display_name'">
                <b data-toggle="tooltip" [title]="tooltips[param.key]">{{param.key}}</b> : <i>{{param.value}}</i>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    `,
  providers: [HttpService]
})
export class AdminModelsHistoryComponent implements OnInit{

  models: Model[] = [];

  tooltips = {
    train_accuracy: 'Доля правильно классифицированных объектов (обучающая выборка)',
    train_recall: 'Полнота (обучающая выборка)',
    train_precision: 'Точность (обучающая выборка)',
    train_f_score: 'F-мера (обучающая выборка)',
    test_accuracy: 'Доля правильно классифицированных объектов (тестовая выборка)',
    test_recall: 'Полнота (тестовая выборка)',
    test_precision: 'Точность (тестовая выборка)',
    test_f_score: 'F-мера (тестовая выборка)',
    date: 'Дата обучения модели',
  }

  info(model): any{
    if (model.isshown !== false && model.isshown !== true) { model.isshown = true; }
    else { model.isshown = !model.isshown; }
  }

  constructor(private httpService: HttpService, private route: Router){}

  ngOnInit(): any {
    if (CookieManager.getCookie('user') !== '') {
      this.httpService.getRequest(SystemInfo.systemUrl + '?command=get_fitting_history').subscribe(
        (data: any) => {
          this.models = data['data'];
        });
    }
    else{
      this.route.navigate(['login']);
    }
  }
}

export class Model {
  id: string;
  model_type_id	: string;
  parameters: string;
  train_accuracy: number;
  train_recall: number;
  train_precision: number;
  train_f_score: number;
  test_accuracy: number;
  test_recall: number;
  test_precision: number;
  test_f_score: number;
  date: string;
}


