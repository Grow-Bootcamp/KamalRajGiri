import { products } from '../data/products'
import { useNavigate, useParams, } from 'react-router-dom'

function ProductDetails() {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    const isValidId = id !==undefined && /^[1-9]\d*$/.test(id);
    const numericId = isValidId ? Number(id) : NaN;

    const product = products.find((p)=>p.id === numericId);

    if(!product){
        return(
            <section>
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist.</p>

                <button onClick={()=> navigate(-1)}>Go Back</button>
            </section>
        );
    }
  return (
<section>
<h2>{product.name}</h2>
<p>Price: ${product.price}</p>

<button onClick={()=> navigate(-1)}>Go Back</button>
</section>
  )
}

export default ProductDetails
