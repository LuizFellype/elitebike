

import React from 'react';
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { withRouter } from 'react-router-dom';
import copy from 'clipboard-copy';
import { useToastContext } from './hooks/ToastContext';

const servicesOptions = [
    { name: 'Revisão Sport', code: 'Revisão Sport' },
    { name: 'Revisão Comp', code: 'Revisão Comp' },
    { name: 'Revisão Pro', code: 'Revisão Pro' },
    { name: 'Revisão Balança', code: 'Revisão Balança' },
    { name: 'Revisão Suspensão', code: 'Revisão Suspensão' },

    { name: 'Lavagem ', code: 'Lavagem' },
    { name: 'Regulagem', code: 'Regulagem' },
    { name: 'Desempenho', code: 'Desempenho' },
    { name: 'Enraiar roda', code: 'Enraiar roda' },
    { name: 'Sangria', code: 'Sangria' },
    { name: 'Embalar', code: 'Embalar' },
    { name: 'Montar', code: 'Montar' },
    { name: 'Troca de peças', code: 'Troca de peças' }
]


const OSForm = props => {
    const toastRef = useToastContext()
    const [checkIn, setCheckIn] = React.useState(() => new Date())
    const [returned, setReturned] = React.useState()
    const [phone, setPhone] = React.useState('')
    const [services, setServices] = React.useState()
    const nameRef = React.useRef(null)
    const mechanicRef = React.useRef(null)
    const bikeRef = React.useRef(null)
    const valueRef = React.useRef(null)

    // pre-populate inputs  
    React.useEffect(() => {
        if (!!props.selected) {
            const {
                name,
                phone: phoneSelected,
                bike,
                value,
                mechanic,
                services: _services,
                checkIn: _checkIn,
                returned: _returned,
            } = props.selected
            console.log('FORM props.selected', props.selected)

            nameRef.current.element.value = name
            bikeRef.current.element.value = bike
            mechanicRef.current.element.value = mechanic
            setPhone(phoneSelected)
            setServices(_services)
            valueRef.current.inputEl.value = value
            setCheckIn(new Date(_checkIn))
            _returned && setReturned(new Date(_returned))
        }
    }, [props.selected])

    const isUpdating = !!props.selected
    // const servicesTotalAmount = services.reduce((acc, { value }) => {
    //     return acc + normalizeCurrency(value)
    // }, 0)

    const handleForm = (e) => {
        e.preventDefault()
        const formValues = {
            name: nameRef.current.element.value,
            bike: bikeRef.current.element.value,
            phone: phone,
            services,
            mechanic: mechanicRef.current.element.value,
            value: valueRef.current.inputEl.value,
            checkIn: !!checkIn ? new Date(checkIn).getTime() : new Date().getTime(),
            returned: !!returned ? new Date(returned).getTime() : new Date().getTime(),
        }

        isUpdating ? props.onSubmit({ ...props.selected, ...formValues }, props.selected.id) : props.onSubmit(formValues)
    }

    if (props.viewOnly && !props.selected) return <></>


    return (
        <Card >
            <div className='p-d-flex p-ai-center p-jc-between p-mb-2'>
                {props.selected && <img src="https://scontent.fvix1-1.fna.fbcdn.net/v/t1.0-9/50549129_2462771803795299_8027391492240703488_o.jpg?_nc_cat=106&ccb=2&_nc_sid=09cbfe&_nc_ohc=gD1E9Bqu5TYAX8u2Cxu&_nc_ht=scontent.fvix1-1.fna&oh=0f4292a5cd4325eaa6446f5826080b66&oe=60101FE5" width='60px' alt="Elite Bike logo" />}
                {
                    props.selected && <span className="p-tag p-tag-rounded">OS SELECIONADA: <b>{isUpdating && props.selected.osNumber}</b></span>
                }
            </div>
            <form id="react-no-print" onSubmit={handleForm}>
                <div className="p-d-flex p-flex-column">
                    <div className="p-fluid p-formgrid p-grid">

                        <div className="p-field p-col-6 p-sm-6 p-md-4">
                            <label htmlFor="firstname6">Nome</label>
                            <InputText disabled={props.viewOnly} id="firstname6" type="text" placeholder="ex.: Luiz Fellype" ref={nameRef} required />
                        </div>
                        <div className="p-field p-col-6 p-sm-6 p-md-4">
                            <label htmlFor="phone">Telefone</label>
                            <InputMask disabled={props.viewOnly} id="phone" mask="999999999?99" value={phone} onChange={e => setPhone(e.value)} required />
                        </div>
                        <div className="p-field p-col-6 p-sm-6 p-md-4">
                            <label htmlFor="bike">Bike</label>
                            <InputText disabled={props.viewOnly} id="bike" type="text" ref={bikeRef} required />
                        </div>

                        <div className="p-field p-col-6 p-sm-6 p-lg-5">
                            <label htmlFor="mechanic">Mecânico</label>
                            <InputText disabled={props.viewOnly} id="mechanic" type="text" ref={mechanicRef} required />
                        </div>


                        <div className="p-field p-col-12 p-md-6 p-lg-7">
                            <label htmlFor="services">Serviços</label>
                            <MultiSelect value={services} id='services' options={servicesOptions} onChange={(e) =>
                                setServices(e.value)
                            } optionLabel="name" display="chip" placeholder='Selecione o(s) serviço(s)' />
                        </div>

                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="checkIn">Check in</label>
                            <Calendar disabled={props.viewOnly} id="checkIn" showIcon value={checkIn} onChange={e => setCheckIn(e.value)} dateFormat='dd/mm/yy' />
                        </div>
                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="returned">Check out: </label>
                            {returned ? <Calendar disabled id="checkIn" showIcon value={new Date(returned)} dateFormat='dd/mm/yy' /> : <Button onClick={() => setReturned(new Date().getTime())} label='Retirar' tooltip='Clique e salve para adicionar a data de retirada'/>}
                        </div>

                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="value">Valor</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <span>R$</span>
                                </span>
                                <span className="p-float-label">
                                    <InputNumber disabled={props.viewOnly} id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} ref={valueRef} />
                                    <label htmlFor="inputgroup" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={'p-d-flex p-jc-end hide-on-print'} >
                        {props.selected && <Button label='Compartilhar' onClick={async () => {
                            const sharableUrl = `${window.location.origin}/#/os/${props.selected.osNumber}`
                            try {
                                await navigator.share({
                                    title: `OS: ${props.selected.osNumber} - Elite Bike`,
                                    text: 'Detalhes de sua Ordem de Serviço na Elite Bike',
                                    url: sharableUrl
                                })
                            } catch (error) {
                                copy(sharableUrl)
                                toastRef.current.show({
                                    severity: 'success',
                                    summary: 'SUCESSO!',
                                    detail: 'Link compartilhável da OS copiado com sucesso.'
                                })
                            }
                        }} type='button' className="p-button-outlined p-button-primary button-sm" />}

                        <div className={`${props.viewOnly ? 'd-p-none' : 'p-d-flex'}`} >
                            <Button label='Cancelar' onClick={props.onCancel} type='button' className="p-button-outlined p-button-secondary p-ml-1 button-sm" />
                            <Button type='submit' label={isUpdating ? 'Atualizar' : 'Salvar'} className="p-button-success p-ml-1 button-sm" />
                        </div>
                    </div >
                </div >
            </form>
        </Card>
    );
}

export default withRouter(OSForm)