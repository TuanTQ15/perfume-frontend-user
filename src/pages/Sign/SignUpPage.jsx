import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import callApi from '../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import isEmail from "validator/lib/isEmail"
import ReactDatePicker from 'react-datepicker'
import { actSignUpReq, actUpdateUser } from '../../actions/user'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenUser } from '../../actions/getUser'
import NotFound from '../NotFound/NotFound'

const MySwal = withReactContent(Swal)
export const SignUpPage = ({ match, history, handleSignUp, handleUpdateUser }) => {

    const [checkAdd, setcheckAdd] = useState(true)
    // const [order, setOrder] = useState(null)
    const [user, setuser] = useState({
       
        fullName: '',
        dateOfBirth: new Date(),
        address: '',
        phoneNumber: '',
        email: '',
        password: '',
        role:'ROLE_USER'
    })

    const [validationMsg, setvalidationMsg] = useState('')

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const validateAll = () => {
        const msg = {}
        // if (isEmpty(user.role)) {
        //     msg.role = "Quyền này không được để trống"
        // } else if (user.length > 10) {
        //     msg.role = "Mã nhân viên không được dài hơn 10 kí tự"
        // }

        if (isEmpty(user.fullName)) {
            msg.fullName = "Trường này không được để trống"
        }

        if (isEmpty(user.address)) {
            msg.address = "Trường này không được để trống"
        }

        if (getAge(user.dateOfBirth) < 12) {
            msg.dateOfBirth = "Khách hàng cần trên 12 tuổi"
        }

        if (isEmpty(user.email)) {
            msg.email = "Trường này không được để trống"
        } else if (!isEmail(user.email)) {
            msg.email = "Trường này phải là email"
        }

        if (isEmpty(user.password)) {
            msg.password = "Trường này không được để trống"
        } else if (user.password.length < 6) {
            msg.password = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(user.password)) {
            msg.password = "PassWord không được chứa khoảng trống"
        }

        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    useEffect(() => {
        (async () => {
            if (match.params.id === undefined) {
                setcheckAdd(true)
            } else {
                await callApi(`customer/${match.params.id}`, 'GET', null, `Bearer ${getTokenUser()}`).then(res => {
                    if(res.status===404){

                    }
                    // setuser(res.data)
                    setuser({
                        ...res.data,
                        dateOfBirth: new Date(res.data.dateOfBirth)
                    })
                });
                setcheckAdd(false)
            }

        })()

        //eslint-disable-next-line
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate
        console.log(user)

        if (isValid) {
            // console.log(JSON.stringify(user))
            if (checkAdd === true) {
                let res = await handleSignUp(user)
                
                if (res === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Tạo tài khoản thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                
                    history.push('/signin')
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message
                    })
               
                }
            } else {
                let res = await handleUpdateUser(user);
                if (res.result === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Sửa thông tin thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.goBack()
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message
                    })
                }
            }

        }
    }

    return (
        <div className="row justify-content-center col-md-8 d-flex" style={{ margin: 'auto' }}>
            <div className="col-xl-10 col-lg-12 col-md-9">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="container" >
                        {/* style ={{marginLeft: 220}} */}
                        <div className="text-center" style={{ marginTop: 40, fontSize: 20 }}>
                            <Link to='/' className="fas fa-home" style={{ textDecoration: 'none' }}></Link>
                        </div>

                        <div className="py-3 mb-20" >
                            <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                                {checkAdd ? "Tạo tài khoản" : "Sửa thông tin cá nhân"}
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            {/* <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Chứng minh thư (<small className="text-danger">*</small>)</label>
                                <input id="MA_KH" value={user.MA_KH}
                                    onChange={e => setuser({ ...user, MA_KH: e.target.value })}
                                    placeholder="Mã nhân viên" className="form-control input-md" type="text"
                                    readOnly={checkAdd ? false : true} />
                                <small className="form-text text-danger">{validationMsg.MA_KH}</small>
                            </div> */}
                            <div className="form-group">
                                <label className="control-label" htmlFor="fullName">Họ và tên(<small className="text-danger">*</small>)</label>
                                <input id="fullName" value={user.fullName}
                                    onChange={e => setuser({ ...user, fullName: e.target.value })}
                                    className="form-control input-md" type="text"
                                    placeholder="Họ và tên" />
                                <small className="form-text text-danger">{validationMsg.fullName}</small>
                            </div>

                            <div className="form-group">
                                <label className=" control-label" htmlFor="NVGH">Ngày sinh(<small className="text-danger">*</small>)</label>
                                <ReactDatePicker
                                    className="form-control"
                                    selected={user.dateOfBirth}
                                    // onSelect={handleDateSelect} //when day is clicked
                                    onChange={date => setuser({ ...user, dateOfBirth: date })} //only when value has changed
                                />
                                <small className="form-text text-danger">{validationMsg.dateOfBirth}</small>
                            </div>


                            <div className="form-group">
                                <label className="control-label" htmlFor="address">Địa chỉ(<small className="text-danger">*</small>)</label>
                                <input id="address" value={user.address}
                                    className="form-control input-md" type="text"
                                    onChange={e => setuser({ ...user, address: e.target.value })}
                                    placeholder="Địa chỉ"
                                />
                                <small className="form-text text-danger">{validationMsg.address}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="phoneNumber">Số điện thoại(<small className="text-danger">*</small>)</label>
                                <input id="phoneNumber" value={user.phoneNumber}
                                    className="form-control input-md" type="number"
                                    onChange={e => setuser({ ...user, phoneNumber: e.target.value })}
                                    placeholder="Số điện thoại"
                                />
                                <small className="form-text text-danger">{validationMsg.phoneNumber}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="email">Email(<small className="text-danger">*</small>)</label>
                                <input id="email" value={user.email}
                                    className="form-control input-md" type="text"
                                    onChange={e => setuser({ ...user, email: e.target.value })}
                                    placeholder="Email"
                                />
                                <small className="form-text text-danger">{validationMsg.email}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="password">Mật khẩu(<small className="text-danger">*</small>)</label>
                                <input id="password" value={user.password}
                                    className="form-control input-md" type="password"
                                    onChange={e => setuser({ ...user, password: e.target.value })}
                                    placeholder="Mật khẩu"
                                />
                                <small className="form-text text-danger">{validationMsg.password}</small>
                            </div>

                            <button style={{ marginBottom: 40, width: '100%' }} type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        handleSignUp: user => {
            return dispatch(actSignUpReq(user))
        },
        handleUpdateUser: user => {
            return dispatch(actUpdateUser(user))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)

