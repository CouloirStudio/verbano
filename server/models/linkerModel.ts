class LinkerModel {
    constructor(private linkID: number, private linkType: string, private linkList: Array<any>) {}
  
    createLink(): void {
      // logic here
    }
  
    removeLink(): void {
      // logic here
    }
  
    getLinks(): Array<any> {
      // logic here
      return this.linkList; // placeholder
    }
  }
  
  export default LinkerModel;