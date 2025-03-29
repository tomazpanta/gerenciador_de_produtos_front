import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrash,
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from '../../api';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [modalInfoAberto, setModalInfoAberto] = useState(false);

  useEffect(() => {
    axios
      .get('/clientes')
      .then((response) => setClientes(response.data))
      .catch((error) => console.error('Erro ao carregar clientes', error));
  }, []);

  const abrirModalExclusao = (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  const fecharModalExclusao = () => {
    setClienteSelecionado(null);
    setModalAberto(false);
  };

  const abrirModalSucesso = () => {
    setModalSucessoAberto(true);
    setTimeout(() => setModalSucessoAberto(false), 2000);
  };

  const abrirModalInfo = (cliente) => {
    setClienteSelecionado(cliente);
    setModalInfoAberto(true);
  };

  const fecharModalInfo = () => {
    setClienteSelecionado(null);
    setModalInfoAberto(false);
  };

  const removerCliente = () => {
    axios
      .delete(`/clientes/${clienteSelecionado.id}`)
      .then(() => {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.id !== clienteSelecionado.id)
        );
        fecharModalExclusao();
        abrirModalSucesso();
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ position: 'relative' }}>
        Lista de Clientes
      </h2>
      <Link to="/add-clientes" className="btn btn-primary mb-2">
        <FaPlus className="icon" /> Adicionar Cliente
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>Nome:</th>
            <th>Cpf:</th>
            <th>Email:</th>
            <th>Ações:</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</td>
              <td>{cliente.email}</td>
              <td>
                <button
                  onClick={() => abrirModalInfo(cliente)}
                  className="btn btn-sm btn-dark rounded"
                  style={{
                    margin: "8px",
                    border: '1px solid #000',
                    color: '#fff',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <FaMapMarkerAlt className="icon" />
                  Ver Endereço
                </button>
                <Link
                  to={`/edit-clientes/${cliente.id}`}
                  className="btn btn-sm btn-warning"
                >
                  <FaEdit className="icon icon-btn" />
                  Editar
                </Link>
                <button
                  onClick={() => abrirModalExclusao(cliente)}
                  className="btn btn-sm btn-danger"
                >
                  <FaTrash className="icon icon-btn" />
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de exclusão */}
      <Modal
        isOpen={modalAberto}
        onRequestClose={fecharModalExclusao}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaExclamationTriangle className="icon" />
          <h2>Confirmar Exclusão</h2>
          <p>
            Tem certeza que deseja excluir o cliente
            <br />
            {clienteSelecionado && clienteSelecionado.nome}?
          </p>
          <div className="modalButtons">
            <button onClick={fecharModalExclusao} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={removerCliente} className="btn btn-danger">
              Excluir
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de sucesso */}
      <Modal
        isOpen={modalSucessoAberto}
        onRequestClose={() => setModalSucessoAberto(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaCheckCircle className="icon successIcon" />
          <h2>Cliente excluído com sucesso!</h2>
        </div>
      </Modal>

      {/* Modal de informações do cliente */}
      <Modal
        isOpen={modalInfoAberto}
        onRequestClose={fecharModalInfo}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <h2>Endereço do Cliente</h2>
          {clienteSelecionado && (
            <div>
              <p><strong>CEP:</strong> {clienteSelecionado.cep}</p>
              <p><strong>Rua:</strong> {clienteSelecionado.rua}</p>
              <p><strong>Número:</strong> {clienteSelecionado.numero}</p>
              <p><strong>Bairro:</strong> {clienteSelecionado.bairro}</p>
              <p><strong>Cidade:</strong> {clienteSelecionado.cidade}</p>
              <p><strong>Estado:</strong> {clienteSelecionado.estado}</p>
              <p><strong>País:</strong> {clienteSelecionado.pais}</p>
            </div>
          )}
          <button onClick={fecharModalInfo} className="btn btn-primary mt-3">
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ClienteList;
