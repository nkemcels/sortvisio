import * as d3 from "d3";

export default class D3VisioManager {
    constructor(anchorDomNode, data, dataRange){
        this.anchorDomNode = anchorDomNode;
        this.data = data;
        this.metaData = {"compare":[], "swap":[]};
        this.dataRange = dataRange
    }

    drawGraph = ()=>{
        let rect = this.anchorDomNode.getBoundingClientRect(); 
        let barWidth = rect.width/this.data.length;
        let barMargin = barWidth;

        let scaleY = d3.scaleLinear()
                            .domain(this.dataRange)
                            .range([7, rect.height-20])
        let gNodes = d3.select(this.anchorDomNode).selectAll("g").remove().exit().data(this.data);

        let gBar = gNodes.enter()
            .append("g");
        gBar.append("rect")    
            .attr("class", "bar")
            .style("height", d=>scaleY(d)+"px")
            .style("width", (barWidth-barWidth*0.5)+"px")
            .style("fill", 
                (d,i)=>this.metaData.compare.includes(i)? "#c62828":
                this.metaData.swap.includes(i)? "#1565C0" : "#008f3b")
            .style("x", (d, i)=>(i*barMargin)+"px");

            gBar.append("text")
            .attr("x", (d, i)=>(i*barMargin )+"px")
            .attr("y", d=>(scaleY(d)+10)+"px")
            .style("font-size", "9px")
            .style("font-weight", "bold")
            .text(d=>d)    
    }

    updateDataRange = (dataRange)=>{
        this.dataRange = dataRange || this.dataRange;
    }

    updateGraph = (data, metaData)=>{
        this.data = data;
        this.metaData = {"compare":(metaData||{}).compare||[], "swap":(metaData||{}).swap||[]};

        this.drawGraph();
    }
}