import React, { Component } from 'react';
import Modal from '../Modal';
import LogsInfo from '../LogsInfo';
import { getAPIKeys, disableAPIKey } from '../../services/api';
import { formatKeysData, columnsHeaders } from './utils';
export default class Table extends Component{
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      show: false
    };
      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        getAPIKeys().then(({ data }) => {
          const keysData = formatKeysData(data);
          this.setState({ data: keysData, isLoaded: true });
        }).catch(error => this.setState({ isLoaded: true, error }));  
    }

    showModal = () => {
      this.setState({ show: true });
    };

    hideModal = () => {
      this.setState({ show: false });
    };

    disableKey = ev => {
      const keyID = ev.currentTarget.value;
      disableAPIKey(keyID).then(() => {
        let updatedKeys = [...this.state.data];
        updatedKeys = updatedKeys.filter(key => key.id !== keyID);
        this.setState({ data: updatedKeys });
      });
    }

  render() {
    const { error, isLoaded, data } = this.state;
    if (error) {
      return (<div>Error: {error.message}</div>)
    };
    
    return (
    <div>
      <table>
        <thead>
          <tr>
            {columnsHeaders.map((header,i) => (
            <th key={`_${i}`}>
              {`${header}`}
            </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoaded ? data.map(({id, _status, logs}, i) => (
            <tr className="flex justify-between">
              <td>{`${id}`}</td>
              <td>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                  <LogsInfo logs={logs}/>
                </Modal>
                <button type="button" onClick={this.showModal}>
                  <span role="img" aria-label="search-icon">🔎</span>
                </button>
              </td>
              <td>
                <button type="button" value={id} onClick={this.disableKey}>
                  <span role="img" aria-label="cross">❌</span>
                </button>
              </td>
            </tr>
          )) : <div>Loading data...</div>}
        </tbody>
      </table>
    </div>
    );
  }
}