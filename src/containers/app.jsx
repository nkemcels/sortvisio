import React, { Component } from 'react';
import ReactDOM from "react-dom";
import D3VisioManager from "./d3Manager";
import "../assets/sass/styles.scss";
import { getRandomInt } from '../utils/misc';

class App extends Component{
    constructor(props) {
        super(props);
        this.sortVisioRef = React.createRef();
        this.state = {
            animationSpeed: 10,
            dataSet: [],
            dataRange: "5-60",
            dataLength: 50,
            sortOrder: "DEC",
            algorithm: "BUBBLE_SORT",
            stop: true
        }
    }
    componentDidMount(){
        let visioDomNode = ReactDOM.findDOMNode( this.sortVisioRef.current );
        this.setState({
            dataSet: this.generateData(this.state.dataRange, this.state.dataLength)
        }, ()=>{
            this.d3Manager = new D3VisioManager(visioDomNode, this.state.dataSet, this.state.dataRange.split("-").map(d=>+d));
            this.d3Manager.drawGraph();
        })
    }
    generateData = (range, count)=>{
        range = range.trim().split("-").map(d=>+d)
        let min = range[0], max = range[1];
        let array = [];

        for(let i=0; i<=count; i++){
            array.push(getRandomInt(min, max))
        }

        return array;
    }
    compare = (i, j, data, order)=>{
        this.d3Manager.updateGraph(data, {"compare":[i,j], "swap":[]})
        if(data[i]>data[j] && order=="DEC") return 1;
        if(data[i]<data[j] && order=="INC") return 1;
        return 0;
    }
    compare2 = (i, j, data, order)=>{

    }

    swap = (i, j, data)=>{
        this.d3Manager.updateGraph(data, {"swap":[i,j], "compare":[]})
        let temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }

    bubbleSort = (i, j, data, order)=> {
        if(i<data.length && !this.state.stop){
            if(j<data.length){
                if(this.compare(i, j, data, order) == 1){
                    this.swap(i, j, data);
                }
                j++;
            }else{
                j=0; i++;
            }
            this.timeoutId = setTimeout(() => {
                this.bubbleSort(i, j, data, order);
            }, this.state.animationSpeed);
        }else{
            this.d3Manager.updateGraph(data);
        }
    }

    insertionSort = (i, j, data, order)=> {
        if(i<data.length && !this.state.stop){
            j = i-1;
            if(j>=0 && this.compare(i, j, data, order) == 1){
                if(this.compare(i, j, data, order) == 1){
                    data[j+1] = data[j];
                    this.d3Manager.updateGraph(data, {"swap":[j+1]})
                }
                j--;
            }else{
                data[j+1] = data[i]; i++;
            }
            this.timeoutId = setTimeout(() => {
                this.insertionSort(i, j, data, order);
            }, this.state.animationSpeed);
        }else{
            this.d3Manager.updateGraph(data);
        }
    }

    selectionSort = (i, j, m, data, order)=> {
        if(i<data.length && !this.state.stop){
            if(j<data.length){
                if(this.compare(j, m, data, order) == 1){
                    m = j;
                }
                j++;
            }else{
                if(m!==i){
                    this.swap(i, m, data);
                }
                i++; j=i+1; m = i;
            }
            this.timeoutId = setTimeout(() => {
                this.selectionSort(i, j, m, data, order);
            }, this.state.animationSpeed);
        }else{
            this.d3Manager.updateGraph(data);
        }
    }

    startBubbleSortSimulation = (dataSet, order)=>{
        this.setState({
            stop: false
        }, ()=>{
            let i=0, j=0;
            this.timeoutId = setTimeout(() => {
                this.bubbleSort(i, j, dataSet, order);
            }, this.state.animationSpeed);
        })
    }

    startSelectionSortSimulation = (dataSet, order)=>{
        this.setState({
            stop: false
        }, ()=>{
            let i=0, j=0, m=0;
            this.timeoutId = setTimeout(() => {
                this.selectionSort(i, j, m, dataSet, order);
            }, this.state.animationSpeed);
        })
    }

    startInsertionSortSimulation = (dataSet, order)=>{
        this.setState({
            stop: false
        }, ()=>{
            let i=0, j=0;
            this.timeoutId = setTimeout(() => {
                this.bubbleSort(i, j, dataSet, order);
            }, this.state.animationSpeed);
        })
    }
    
    startSimulation = (evt)=>{
        evt && evt.preventDefault();
        let dataSet = [...this.state.dataSet];
        let order = this.state.sortOrder;

        this.stopSimulation();
        clearTimeout(this.timeoutId);
        this.d3Manager.updateGraph(this.state.dataSet)

        switch(this.state.algorithm){
            case "BUBBLE_SORT":
                return this.startBubbleSortSimulation(dataSet, order)
            case "SELECTION_SORT":
                return this.startSelectionSortSimulation(dataSet, order)
            case "INSERTION_SORT":
                return this.startInsertionSortSimulation(dataSet, order);
                        
        }
    }
    stopSimulation = (evt)=> {
        evt && evt.preventDefault();

        this.setState({
            stop:true
        });
    }
    generateNewArray = ()=>{
        let range = this.state.dataRange;
        if((range||"").match(/\s*\d+\s*-\s*\d+\s*/)){
            this.stopSimulation();
            this.setState({
                dataSet: this.generateData(range, this.state.dataLength)
            }, ()=>{
                this.d3Manager.updateDataRange(range.trim().split("-").map(d=>+d))
                this.d3Manager.updateGraph(this.state.dataSet)
            });
        }else{
            alert("Please enter valid data range. Example: 20-80")
        }
    }
    render(){
        return(
            <div className="app-container">
                <div className="header">
                    <div className="main">
                        <h3>SortVisio</h3>
                    </div>
                    <div className="sub">
                        <h3>{this.state.algorithm.replace(/_/g, " ")}</h3>
                    </div>
                </div>
				<div className="app-body">
                    <div className="sidebar-controls">
                        <div className="form">
                            <div className="form-item">
                                <span className="title">Data Range</span>
                                <input className="form-control" value={this.state.dataRange} onChange={(evt)=>{
                                    this.setState({
                                        dataRange: evt.target.value
                                    })
                                }}/>
                                <div className="sub-item">
                                    <span className="title">Array Length</span>
                                    <input className="form-control" type="number" value={""+this.state.dataLength} onChange={(evt)=>{
                                        this.setState({dataLength:evt.target.value})
                                    }}/>
                                </div>
                                <div className="control">
                                    <button onClick={this.generateNewArray}>Generate New Array</button>
                                </div>
                            </div>
                            <div className="form-item">
                                <span className="title">Animation Delay</span><span>({this.state.animationSpeed}ms)</span>
                                <input type="range" min="0" max="2000" step="2" className="form-control" value={""+this.state.animationSpeed} onChange={(evt)=>{
                                    this.setState({animationSpeed:+evt.target.value})
                                }} style={{outline:"none", width:"100%"}}/>
                            </div>
                            <div className="form-item">
                                <span className="title">Algorithm</span>
                                <select onChange={(evt)=>this.setState({algorithm:evt.target.value})}>
                                    <option value="BUBBLE_SORT">Bubble Sort</option>
                                    <option value="SELECTION_SORT">Selection Sort</option>
                                    <option value="INSERTION_SORT">Insertion Sort</option>
                                </select>
                            </div>
                            <div className="form-item">
                                <span className="title">Sort Order</span>
                                <select onChange={(evt)=>this.setState({sortOrder:evt.target.value})}>
                                    <option value="INC">Increasing order</option>
                                    <option value="DEC" selected>Decreasing order</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="animation-arena">
                        <div className="animation-area">
                            <div className="animation-view">
                                <div className="animation-component">
                                    <div className="header">

                                    </div>
                                    <div className="content">
                                        <svg ref={this.sortVisioRef} width="100%" height="100%"></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="legend-view">
                                <div className="legend-item">
                                    <span className="color" style={{background:"#1565C0"}}/>
                                    <span className="description">Swapping elements</span>
                                </div>
                                <div className="legend-item">
                                    <span className="color" style={{background:"#c62828"}}/>
                                    <span className="description">Comparing elements</span>
                                </div>
                                <div className="legend-item">
                                    <span className="color" style={{background:"#008f3b"}}/>
                                    <span className="description">Array element</span>
                                </div>
                            </div>
                        </div>
                        <div className="animation-controls">
                            <a href="#" className="btn btn-start" onClick={this.startSimulation}>Start</a> 
                            <a href="#" className="btn btn-stop" onClick={this.stopSimulation}>Stop</a>
                        </div>
                    </div>
                    <div className="legend-view">

                    </div>
                </div>
            </div>
        )
    }
}

export default App;