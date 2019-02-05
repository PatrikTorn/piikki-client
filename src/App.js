import React, { Component } from 'react';
import {Connect} from './actions';
import Header from './Header';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './App.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker , { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi'
import "react-datepicker/dist/react-datepicker.css";
import { 
    Nav, 
    NavItem, 
    NavLink, 
    Container, 
    Row, 
    Col, 
    Spinner, 
    InputGroup, 
    Input, 
    InputGroupAddon, 
    Button
} from 'reactstrap';
import moment from 'moment'
import 'moment/locale/fi';
import {Line} from 'react-chartjs-2';
registerLocale('fi', fi);




class App extends Component {
  componentDidMount(){
    this.props.getData({end:this.props.app.end, start:this.props.app.start});
    this.props.getProducts();
    this.props.getUsers();
  }

  getPurchasesPerDay(){
    const {purchases} = this.props.app;
    return purchases.reduce((acc, obj) => {
      return {...acc, [this.formatDate(obj.time)]:acc[this.formatDate(obj.time)] ? acc[this.formatDate(obj.time)] + obj.price : obj.price }
    }, {});
  }

  getDepositsPerDay(){
    const {deposits} = this.props.app;
    return deposits.reduce((acc, obj) => {
      return {...acc, [this.formatDate(obj.time)]:acc[this.formatDate(obj.time)] ? acc[this.formatDate(obj.time)] - obj.price : -obj.price }
    }, {});
  }

  // getProductPurchasesPerDay(productId){
  //   const {purchases, products} = this.props.app;
  //   return purchases
  //   .filter(p => p.product_id === productId)
  //   .reduce((acc, obj) => {
  //     return {...acc, [this.formatDate(obj.time)]:acc[this.formatDate(obj.time)] ? (acc[this.formatDate(obj.time)] + obj.price) : 1 }
  //   }, {})
  // }

  getGraphData(object, label){
    const data = {
      labels: Object.keys(object),
      datasets: [
        {
          label,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Object.values(object)
        }
      ]
    };
    return data;
  }

  getTotal({purchases, deposits}){
    const {products} = this.props.app;
    const depositsTotal = deposits.reduce((acc, deposit) => acc - deposit.price, 0);
    const purchasesTotal = purchases.reduce((acc, obj) => {
      return {
        ...acc, [obj.product]:{
          amount:acc[obj.product] ? (acc[obj.product].money + obj.price) / products[obj.product_id].price : 1,
          money:acc[obj.product] ? acc[obj.product].money + obj.price : obj.price
        },
        'Kaikki ostot':{money:acc['Kaikki ostot'].money + obj.price, amount:purchases.length}
      }
    }, {'Kaikki talletukset': {money:depositsTotal, amount:deposits.length}, 'Kaikki ostot':{ money:0, amount:purchases.length}});
  
    return Object.entries(purchasesTotal).map(([key, value]) => ({...value, money:value.money.toFixed(1), amount:value.amount.toFixed(0),name:key}))
  }

  adminFormatter = (cell, row) => {
      return <Button 
      color={row.is_admin ? 'success' : 'danger'}
      onClick={() => this.props.setAdmin(row)}
      >{row.is_admin ? 'Poista admin' : 'Lisää admin'}
      </Button>;
  }

  getContent(){
    const {purchases, deposits, start, end, users} = this.props.app;
    const purchasesTotal = this.getTotal({purchases, deposits});
    switch(this.props.app.screen){
      case 1:
      return <React.Fragment>
        <h1>Yhteenveto</h1>
        <BootstrapTable data={purchasesTotal} striped hover version='4' exportCSV csvFileName={`piikki/${start}/${end}/yhteenveto.csv`}>
          <TableHeaderColumn isKey dataField='name' >Tuote</TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>Määrä (kpl)</TableHeaderColumn>
          <TableHeaderColumn dataField='money'>Rahamäärä (€)</TableHeaderColumn>
        </BootstrapTable>
      </React.Fragment>
      case 2:
      return <React.Fragment>
        <h1>Ostot</h1>
        <div><Line data={this.getGraphData(this.getPurchasesPerDay(), 'Ostotapahtumat')} height={300} options={{maintainAspectRatio: false}}/></div>
        <BootstrapTable data={purchases} striped hover version='4' exportCSV csvFileName={`piikki/${start}/${end}/ostot.csv`}>
          <TableHeaderColumn isKey dataField='name' filter={ { type: 'TextFilter', delay: 0 } } dataSort>Nimi</TableHeaderColumn>
          <TableHeaderColumn dataField='product' filter={ { type: 'TextFilter', delay: 0 } } dataSort>Tuote</TableHeaderColumn>
          <TableHeaderColumn dataField='price'>Rahamäärä (€)</TableHeaderColumn>
          <TableHeaderColumn dataField='time' dataSort={true}>Aika</TableHeaderColumn>
        </BootstrapTable>
      </React.Fragment>
      case 4:
      return <React.Fragment>
      <h1>Käyttäjät</h1>
      <BootstrapTable data={users} striped hover version='4' exportCSV csvFileName={`piikki/${start}/${end}/kayttajat.csv`}>
        <TableHeaderColumn isKey dataField='name' filter={ { type: 'TextFilter', delay: 0 } } dataSort>Nimi</TableHeaderColumn>
        <TableHeaderColumn dataField='is_admin' dataSort dataFormat={this.adminFormatter}>Admin</TableHeaderColumn>
        <TableHeaderColumn dataField='balance' dataSort>Rahamäärä (€)</TableHeaderColumn>
        <TableHeaderColumn dataField='created_at' dataSort>Luotu</TableHeaderColumn>
      </BootstrapTable>
    </React.Fragment>
      default:
      return <React.Fragment>
        <h1>Talletukset</h1>
        <div><Line data={this.getGraphData(this.getDepositsPerDay(), 'Talletukset')} height={300} options={{maintainAspectRatio: false}}/></div>
        <BootstrapTable data={deposits} striped hover version='4' exportCSV csvFileName={`piikki/${start}/${end}/talletukset.csv`}>
          <TableHeaderColumn isKey dataField='name' filter={ { type: 'TextFilter', delay: 0 } } dataSort>Nimi</TableHeaderColumn>
          <TableHeaderColumn dataField='price' dataSort>Rahamäärä (€)</TableHeaderColumn>
          <TableHeaderColumn dataField='time' dataSort={true}>Aika</TableHeaderColumn>
        </BootstrapTable>
      </React.Fragment>
    }
  }

  setEnd(end){
    end = moment(end).format('YYYY-MM-DD');
    this.props.setState({end});
    this.props.getData({end, start:this.props.app.start});
  }

  setStart(start){
    start = moment(start).format('YYYY-MM-DD');
    this.props.setState({start});
    this.props.getData({start, end:this.props.app.end});
  }

  formatDate(date){
    return moment(new Date(date)).format('LL');
  }

  render() {
    moment().locale('fi');
    const {start, end, purchases, deposits, screen, loading, users} = this.props.app;
    const {setState} = this.props;
    return (
      <div className="App">
         {loading && <div className="loader"><Spinner color="primary" /></div>}
        <Header />
        <Container>
          <Row>
            <Col md="6">
            <Nav pills>
              <NavLink onClick={() => setState({screen:1})} active={screen===1}>Yhteenveto</NavLink>
              <NavLink onClick={() => setState({screen:2})} active={screen===2}>Ostotapahtumat ({purchases.length})</NavLink>
              <NavLink onClick={() => setState({screen:3})} active={screen===3}>Talletukset ({deposits.length})</NavLink>
              <NavLink onClick={() => setState({screen:4})} active={screen===4}>Käyttäjät ({users.length})</NavLink>  
            </Nav>
            </Col>
            <Col md="6" >
              <DatePicker
                disabledNavigation
                disabledKeyboardNavigation
                selected={start}
                onChange={(start) => this.setStart(start)}
                locale='fi'
                customInput={
                  <InputGroup>
                  <InputGroupAddon addonType="prepend">Alkaen</InputGroupAddon>
                  <Input value={this.formatDate(this.props.app.start)} readOnly/>
                  </InputGroup>
                }
              /><br />
              <DatePicker
                disabledNavigation
                disabledKeyboardNavigation
                selected={end}
                onChange={(end) => this.setEnd(end)}
                locale='fi'
                customInput={
                  <InputGroup>
                  <InputGroupAddon addonType="prepend">Päättyen</InputGroupAddon>
                  <Input value={this.formatDate(this.props.app.end)} readOnly />
                  </InputGroup>
                }
              />

            </Col>
          </Row>
    {this.getContent()}

    </Container>

      </div>
    );
  }
}

export default Connect(App);
