export class  Employee{
    employeeId: number;
    employeeName: string;
    contactNo: string;
    emailId: string;
    deptId: number;
    password: string;
    gender: string;
    role: string;
    createdDate:Date;

    constructor(){
      this.employeeId=0;
      this.employeeName='';
      this.contactNo='';
      this.deptId=0;
      this.contactNo='';
      this.emailId='';
      this.gender='';
      this.role='';
      this.password='';
      this.createdDate= new Date()


    }


}