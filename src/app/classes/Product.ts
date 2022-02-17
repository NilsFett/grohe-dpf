export class Product {
  public id:number;
  public image:number;
  public title:string;
  public DFID:string;
  public empty_display:number;
  public display_id:number;
  public SAP:string;
  public supplier:string;
  public product_tree:number=102;
  public price:number;
  public topsign_id:number;
  public promotion_material_id:number;
  public deliverytime : number;
  public base_display_template_id : number;
  public article : Array<any>;
  public display_parts : Array<any>;
  public hide : number;
  public path : any;
}
