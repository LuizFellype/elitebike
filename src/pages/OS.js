import React from 'react';
import { createOS, updateOSById, getOsLastNumber, setOsLastNumber } from '../services/client';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import { OSList } from '../OSList';
import { useAuthCtx } from '../components/Authentication';
import { OSPresentation } from '../components/OsPresentation';
import { FB } from '../firebaseConfig';

function OsPage(props) {
    const [selected, setSelected] = React.useState()
    const [lastOsNumber, setLastOsNumber] = React.useState()
    const toastRef = React.useRef()

    const { isAdmin } = useAuthCtx()

    const { os } = props.match.params


    const handleSubmit = async (data, osId) => {
        let item = {}

        try {
            if (!!osId) {
                item = await updateOSById(data, osId)
            } else {
                const nextNumber = lastOsNumber + 1
                item = await createOS({ ...data, osNumber: nextNumber })
                setOsLastNumber(nextNumber)
            }
            toastRef.current.show({ severity: 'success', summary: 'Sucesso !!!', detail: `OS ${item.osNumber} criada/atualizada com sucesso.` })
            console.log('Set selected: ', item)
            setSelected(item)
        } catch (err) {
            console.log('Error: ', err)
            toastRef.current.show({
                severity: 'error',
                summary: 'Error ao salvar !!',
                detail: 'Não foi possivel no momento, tente novamente mais tarde ou contate o suporte.'
            })
        }
    }

    React.useEffect(() => {
        const checkForLastOsNumber = async () => {
            try {
                const lastNumber = await getOsLastNumber()
                setLastOsNumber(Number(lastNumber))
            } catch (err) {
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Error ineserapdo !!',
                    detail: 'Não foi possivel identificar qual o proximo número de OS por favor recarregue a pagina ou contate o suporte.'
                })
            }
        }

        checkForLastOsNumber()
    }, [])
    // console.log({ isAdmin, os })
    return (
        <>
            <Toast ref={toastRef} />

            <div className='p-d-flex p-jc-between p-ai-center demo-container p-mx-2 p-mt-4 p-m-sm-3 p-mx-lg-6'>
                {!!os ? <Button onClick={() => props.history.push('/')} icon='pi pi-home' tooltip='Ir para pagina principal' className='p-button-outlined' /> : <>
                    <div />
                    <Button onClick={() => FB.auth().signOut()} icon='pi pi-sign-out' tooltip='Deslogar' className='p-button-outlined' />
                </>}
            </div>


            {isAdmin && !!os && <button style={{ float: 'left' }} onClick={() => props.history.push('/')}>Pag. principal</button>}

            <div className={`demo-container p-mx-2 p-mt-4 p-m-sm-3 p-mx-lg-6`}>
                {(isAdmin || !!os) && <OSPresentation selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} viewOnly={!!os} />}

                {!!os && <div className="p-mt-2"></div>}

                <OSList
                    selected={selected}
                    onOSSelect={(_os) => {
                        if (_os.osNumber === selected?.osNumber) return

                        !os && !isAdmin ?
                            props.history.push(`/os/${_os.osNumber}`) :
                            setSelected(_os)
                    }}
                />
            </div>
        </>
    );
}

export default OsPage;
