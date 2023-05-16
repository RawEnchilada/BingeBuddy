export default interface IList{
    list:Array<any>;
    add:(data: any) => Promise<boolean>;
    remove:(id: number) => Promise<boolean>;
    refresh:()=>Promise<void>;

}