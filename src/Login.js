import React, { Component } from 'react';
import { Connect } from './actions';
import { Container, Jumbotron, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Header from './Header'

class Login extends Component {
    state = {
        name: '',
        password: ''
    };

    login() {
        const {name, password} = this.state;
        this.props.login({name, password})
        .then(() => {
            localStorage.setItem('name', name);
            localStorage.setItem('password', password);
        })
        .catch(() => {
            alert("Väärä käyttäjätunnus tai salasana.")
        });
    }



    render() {
        return (
            <div className="App">
                <Header />
                <Container>
                    <Jumbotron>
                        <h2>Kirjaudu sisään</h2>
                        <Form>
                            <FormGroup>
                                <Label for="username">Käyttäjätunnus</Label>
                                <Input type="email" name="email" id="username" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Käyttäjätunnus" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Salasana</Label>
                                <Input type="password" name="password" id="examplePassword" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder="Salasana" />
                            </FormGroup>
                            <Button color="primary" size="lg" block onClick={() => this.login()}>Kirjaudu</Button>
                        </Form>
                    </Jumbotron>
                </Container>
            </div>
        );
    }
}

export default Connect(Login);
