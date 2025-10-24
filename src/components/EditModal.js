import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";

export default function EditModal({ isOpen, onClose, type, onConfirm }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm(inputValue);
    setInputValue("");
    onClose();
  }

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>
            {type === "image" && "Editar imagem de perfil"}
            {type === "name" && "Editar nome"}
            {type === "bio" && "Editar biografia"}
            {type === "post" && "Editar post"}
          </h2>
          <CloseIcon onClick={onClose} />
        </Header>

        <Content>
          {(type === "image" || type === "name" || type === "bio" || type === "post") && (
            <Form onSubmit={handleSubmit}>
              <label>
                {type === "image" && "Nova imagem (URL):"}
                {type === "name" && "Novo nome:"}
                {type === "bio" && "Nova biografia:"}
                {type === "post" && "Nova descrição:"}
              </label>

              {type === "bio" || type === "post" ? (
                <textarea
                  placeholder={
                    type === "bio"
                      ? "Fale um pouco sobre você..."
                      : "Atualize a legenda da foto..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  placeholder={
                    type === "image"
                      ? "Cole o link da nova imagem"
                      : "Digite seu novo nome"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}

              <button type="submit">Salvar</button>
            </Form>
          )}

          {type === "deletePost" && (
            <DeleteContainer>
              <p>Tem certeza que deseja apagar este post?</p>
              <div>
                <button className="cancel" onClick={onClose}>
                  Cancelar
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Apagar
                </button>
              </div>
            </DeleteContainer>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};





const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Modal = styled.div`
  background: white;
  width: 420px;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  animation: fadeIn 0.3s ease;
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    color: #0864f7;
    font-size: 20px;
    margin: 0;
  }
`;

const CloseIcon = styled(IoClose)`
  width: 25px;
  height: 25px;
  color: #0864f7;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #074bcc;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  label {
    font-weight: 600;
    color: #333;
  }

  input, textarea {
    width: 100%;
    border: 1px solid #aec8f1;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 15px;
    resize: none;
    box-sizing: border-box;

    &:focus {
      outline: 2px solid #0864f7;
      border-color: #0864f7;
    }
  }

  button {
    width: 100%;
    background-color: #0864f7;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    &:hover {
      background-color: #074bcc;
    }
  }
`;



const DeleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  p {
    font-size: 16px;
    color: #333;
    text-align: center;
  }

  div {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 48%;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel {
    background-color: #ccc;
    color: #333;
    &:hover {
      background-color: #b0b0b0;
    }
  }

  .delete {
    background-color: #f14b4b;
    color: white;
    &:hover {
      background-color: #d83535;
    }
  }
`;
