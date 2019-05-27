export class Order {
  public id:number;
  public crosscharge:number=0;
  public tracking:number=0;
  public mad:string;

  public hex:string;
  public date:string;
  public userid:number;
  public costcentre:string;
  public costcentrecode:string;
  public promotion_title:string;
  public SAP:number;

  public display_quantity:number;
  public pallet_quantity:number;
  public status:string;
  public delivery:string;
  public product:any;
  public display_parts:any;

  public checklist:string;
  public desired_date_delivery:string;
}
