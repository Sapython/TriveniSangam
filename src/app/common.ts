declare var $: any;

export class CommonFunction {
    /* This is made for setting password visibility */
    public static passwordVisibility(event : any) {
      $(event.target).toggleClass('fa-eye fa-eye-slash');
      let input = $($(event.target).attr('toggle'));
      if (input.attr('type') == 'password') {
        input.attr('type', 'text');
      } else {
          input.attr('type', 'password');
      }
    }

    /* This is made for setting errors of invaliform fields dynamically */
    public static _setErrMsgs = (control: any, errorsObj: any, field: string, validationMessages: any) => {
      if (control && control.invalid) {
        const messages = validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] = messages[key];
            return;
          }
        }
      }
    }

    public static resetForm = (control: any, formError: any) => {
      control.reset();
      control.markAsUntouched();
        for (const field in formError) {
          if (formError.hasOwnProperty(field)) {
            formError[field] = '';
          }
        }
    }

    public static formatDate = (date: any) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) { month = '0' + month; }
      if (day.length < 2) { day = '0' + day; }
      return [day, month, year].join('/');
    }

    public static stringtoDate = (dateStr: any) => {
      const date = new Date(dateStr);
      return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
      // const [day, month, year] = dateStr.split('/');
      // return new Date(year, month - 1, day);
    }
}
