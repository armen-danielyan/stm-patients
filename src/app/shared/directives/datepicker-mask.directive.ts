import { OnDestroy, Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material';
import { Moment } from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { APP_CONFIG_TOKEN, IAppConfig } from '../../app.config';

@Directive({
  selector: '[appDatepickerMask]'
})
export class DatepickerMaskDirective implements OnInit, OnDestroy {

  @Input('appDatepickerMask')
  private appDatepickerMask: any = {};

  private readonly format = 'dd.mm.yyyy';

  private onChange: Function;

  private dateChangeSubscription: Subscription;

  private maskedInputController: any;

  private defaultParams: any;

  constructor (private element: ElementRef,
               private controller: MatDatepickerInput<Moment>,
               @Inject(APP_CONFIG_TOKEN) private config: IAppConfig ) {
    this.defaultParams = {
      inputElement: this.element.nativeElement,
      mask: this.config.mask.date,
      guide: false,
      pipe: createAutoCorrectedDatePipe(this.format)
    };
    this.interceptorControlValueChange();
  }

  ngOnInit() {
    const params = Object.assign({}, this.defaultParams, this.appDatepickerMask);

    this.maskedInputController = textMask.maskInput(params);
    this.dateChangeSubscription = this.controller.dateChange.subscribe(this.onDateChange);
  }

  ngOnDestroy() {
    this.dateChangeSubscription.unsubscribe();
    this.maskedInputController.destroy();
  }

  private interceptorControlValueChange(): void {
    const onChange = this.controller.registerOnChange;

    this.controller.registerOnChange = fn => {
      onChange.call(this.controller, fn);
      this.onChange = fn; // called if manually enter the date
    };
  }

  private onDateChange = (date: MatDatepickerInputEvent<Moment> ): void =>  {
    const { max, min } = this.controller;

    // after the software updates the value, call the model update
    // otherwise the value does not pass validation

    if (max && (date.value > max)) {
      this.controller.writeValue(max);
      this.onChange(max);
    }
    if (min && (date.value < min)) {
      this.controller.writeValue(min);
      this.onChange(min);
    }
  }
}
