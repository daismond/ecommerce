import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Product, ProductVariant } from '../../types/product';
// We'll need a category type as well
// import { Category } from '../../types/category';

// Simplified category type for now
interface Category {
  id: string;
  name: string;
}

const ProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const [product, setProduct] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    is_published: false,
  });
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([
    { sku: '', price: 0, stock: 0, attributes: {} },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories for the dropdown
    apiClient.get<Category[]>('/categories/')
      .then(response => setCategories(response.data))
      .catch(() => setError('Failed to load categories.'));

    // If in edit mode, fetch the product data
    if (isEditMode) {
      setLoading(true);
      apiClient.get<Product>(`/products/${productId}`)
        .then(response => {
          const { variants, ...productData } = response.data;
          setProduct(productData);
          setVariants(variants);
        })
        .catch(() => setError('Failed to load product data.'))
        .finally(() => setLoading(false));
    }
  }, [productId, isEditMode]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    (newVariants[index] as any)[name] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: {} }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { ...product, variants };

    try {
      if (isEditMode) {
        await apiClient.put(`/admin/products/${productId}`, payload);
      } else {
        await apiClient.post('/admin/products/', payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p>Loading form...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>

      {/* Product Details */}
      <input name="title" value={product.title} onChange={handleProductChange} placeholder="Product Title" className="w-full p-2 border" required />
      <input name="slug" value={product.slug} onChange={handleProductChange} placeholder="Product Slug (e.g., my-product)" className="w-full p-2 border" required />
      <textarea name="description" value={product.description} onChange={handleProductChange} placeholder="Description" className="w-full p-2 border" />
      <select name="category_id" value={product.category_id} onChange={handleProductChange} className="w-full p-2 border" required>
        <option value="">Select a Category</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="is_published" checked={product.is_published} onChange={handleProductChange} />
        <span>Published</span>
      </label>

      {/* Variants Section */}
      <h2 className="text-xl font-bold border-t pt-6">Variants</h2>
      {variants.map((variant, index) => (
        <div key={index} className="flex gap-4 items-center border p-4 rounded-lg">
          <input name="sku" value={variant.sku || ''} onChange={e => handleVariantChange(index, e)} placeholder="SKU" className="p-2 border" />
          <input name="price" type="number" value={variant.price} onChange={e => handleVariantChange(index, e)} placeholder="Price" className="p-2 border" />
          <input name="stock" type="number" value={variant.stock} onChange={e => handleVariantChange(index, e)} placeholder="Stock" className="p-2 border" />
          {/* A simplified way to handle attributes for now */}
          <input name="attributes" value={JSON.stringify(variant.attributes)} onChange={e => {
              const newVariants = [...variants];
              try {
                (newVariants[index] as any).attributes = JSON.parse(e.target.value);
                setVariants(newVariants);
              } catch {}
            }} placeholder='Attributes (JSON)' className="p-2 border flex-grow" />
          <button type="button" onClick={() => removeVariant(index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addVariant} className="bg-gray-200 px-4 py-2 rounded-lg">Add Variant</button>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full">
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
};

export default ProductForm;