import React from 'react'
import NumberFormat from 'react-number-format'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actAddToCart } from '../../actions/cart'
const MySwal = withReactContent(Swal)

export const HotSellItem = ({ item, onAddToCart }) => {
    let history = useHistory()

    function handleAddToCart(item) {
        var user = localStorage.getItem('user')
        if (user != null) {
            if (item.SOLUONGTON <= 0) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Sản phẩm đã hết hàng không thể thêm vào giỏ hàng"
                })
            }
            else {
                onAddToCart(item, 1)
                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm sản phẩm vào giỏ hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } else {
            history.push('/signin')
        }
    }
    function show(discount) {
       
        if (discount===undefined||discount<=0||discount===null) {
          return {
            display:"none",
            discount:null
        }
        } else {
          return   {
            display:"block",
            discount:discount.percentDiscount
        }
        }
      }
    let discountEnable= show(item.detailPromotion)
    return (
        <div className="col-md-4">

            <figure className="card card-product">
                <small className="bg-danger" style={{display:discountEnable.display, color: 'white', fontSize: 14, position: "static", width: 30, height: 30 }}>{discountEnable.discount}% </small>
                <Link to={`lineproduct/${item.productId}`} style={{ color: 'black', textDecoration: 'none' }} className="img-wrap"><img src={item.image} alt="" /></Link>
                <Link to={`lineproduct/${item.productId}`} style={{ color: 'black', textDecoration: 'none' }} className="info-wrap">
                    <h4 className="title">{item.productName}</h4>
                    <p className="desc">Xuất xứ:  {item.origin}</p>
                    <p className="desc">Giới tính:  {item.sex === 1 ? 'Nam' : (item.sex === 2 ? "Nữ" : 'Unisex')}</p>
                    <p className="desc">Số đã được mua:  {item.quantitySold}</p>
                </Link>
                <div className="bottom-wrap">
                    <button onClick={() => { handleAddToCart(item) }} className="btn btn-sm btn-primary float-right">Add to cart</button>
                    <div className="price-wrap h5">
                        <NumberFormat displayType="text" thousandSeparator={true} value={item.detailPromotion !== null ? item.price * (100 - item.detailPromotion.percentDiscount) / 100 : item.price} suffix={"đ"} />
                        &nbsp;&nbsp;&nbsp;
                        <del className="price-old"><NumberFormat displayType="text" thousandSeparator={true} value={item.detailPromotion !== null ? item.price : ""} suffix={"đ"} /></del>

                    </div>
                </div>
            </figure>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddToCart: (product, quantity) => {
            dispatch(actAddToCart(product, quantity))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(HotSellItem)
