import styled from 'styled-components';

export default function RepostModal({ isOpen, onClose, onConfirm, isReposting }) {
    if (!isOpen) return null;

    return (
        <ModalBackground onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <h2>Você realmente deseja republicar este Post?</h2>
                <ButtonContainer>
                    <CancelButton onClick={onClose} disabled={isReposting}>
                        Não
                    </CancelButton>
                    <ConfirmButton onClick={onConfirm} disabled={isReposting}>
                        {isReposting ? 'Sharing...' : 'Sim'}
                    </ConfirmButton>
                </ButtonContainer>
            </ModalContent>
        </ModalBackground>
    );
}

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #333;
    color: white;
    padding: 20px;
    border-radius: 20px;
    text-align: center;
    max-width: 500px;
    h2 { font-size: 24px; margin-bottom: 20px; }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
`;

const Button = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;
const CancelButton = styled(Button)` background-color: white; color: #1877F2; `;
const ConfirmButton = styled(Button)` background-color: #1877F2; color: white; `;