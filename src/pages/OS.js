import React from 'react';
import { createOS, updateOSById, getOsLastNumber, setOsLastNumber } from '../services/client';
import { Toast } from 'primereact/toast';

import { OSList } from '../OSList';
import { OSPresentation } from '../components/OsPresentation';
import { useAuthCtx } from '../components/Authentication';

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
            setSelected(item)
        } catch (err) {
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

    const rootNotAdmin = React.useMemo(() => !isAdmin && !os, [isAdmin, os])
    
    return (
        <>
            <Toast ref={toastRef} />
            {isAdmin && !!os && <button style={{ float: 'left' }} onClick={() => props.history.push('/')}>Pag. principal</button>}

            <div className="demo-container p-mx-2 p-mt-4 p-m-sm-5 p-mx-lg-6 ">
                {!rootNotAdmin && <OSPresentation selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} viewOnly={!!os} />}

                {!!os && <div className="p-mt-2"></div>}

                <OSList
                    onOSSelect={!!os ? setSelected : (os) => props.history.push(`/os/${os.osNumber}`)}
                />
            </div>
        </>
    );
}

export default OsPage;
