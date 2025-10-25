import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { AppContext } from '../App';
import { AppContextType, Request, ProductLine, RequestType, RequestProduct } from '../types';
import { PRODUCT_LINES, REQUEST_TYPES, PRODUCTS, PHARMACIES, VENDORS } from '../constants';

const SpinnerIcon = ({ className = "h-5 w-5 text-white" }: {className?: string}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Enhanced Form Field Components with Error Display
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input {...props} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 dark:bg-gray-700 dark:text-white transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
    optionValues?: string[];
    error?: string;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, options, optionValues, error, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <select {...props} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 dark:bg-gray-700 dark:text-white transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`}>
            <option value="">Select...</option>
            {options.map((opt, i) => <option key={i} value={optionValues ? optionValues[i] : opt}>{opt}</option>)}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, error, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <textarea {...props} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 dark:bg-gray-700 dark:text-white transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const NewRequestView: React.FC = () => {
    const { currentUser, addRequest, setCurrentView, ai } = useContext(AppContext) as AppContextType;
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
    const [line, setLine] = useState<ProductLine | ''>('');
    const [requestType, setRequestType] = useState<RequestType | ''>('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [activityObjectives, setActivityObjectives] = useState('');
    const [products, setProducts] = useState<RequestProduct[]>([{ productId: '', units: 0, pharmacies: [] }]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!requestDate) newErrors.requestDate = "Request date is required.";
        if (!line) newErrors.line = "Product line is required.";
        if (!requestType) newErrors.requestType = "Request type is required.";
        
        if (!estimatedCost) {
            newErrors.estimatedCost = "Estimated cost is required.";
        } else if (parseFloat(estimatedCost) <= 0) {
            newErrors.estimatedCost = "Cost must be a positive number.";
        }

        if (!activityObjectives.trim()) {
            newErrors.activityObjectives = "Activity objectives are required.";
        } else if (activityObjectives.trim().length < 20) {
            newErrors.activityObjectives = "Objectives must be at least 20 characters long.";
        }

        products.forEach((p, index) => {
            if (!p.productId) {
                newErrors[`product-${index}-productId`] = "Product selection is required.";
            }
            if (!p.units || p.units <= 0) {
                newErrors[`product-${index}-units`] = "Units must be a positive number.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [requestDate, line, requestType, estimatedCost, activityObjectives, products]);

    const isFormValid = useMemo(() => {
        if (!requestDate || !line || !requestType || !estimatedCost || parseFloat(estimatedCost) <= 0 || !activityObjectives.trim() || activityObjectives.trim().length < 20) {
            return false;
        }
        if (products.some(p => !p.productId || !p.units || p.units <= 0)) {
            return false;
        }
        return true;
    }, [requestDate, line, requestType, estimatedCost, activityObjectives, products]);


    const handleSuggestObjectives = useCallback(async () => {
        if (!ai || !line || !requestType) {
            alert("Please select a Product Line and Request Type first.");
            return;
        }
        setIsSuggesting(true);
        try {
            const prompt = `Generate a concise, professional activity objective for a "${requestType}" for the "${line}" pharmaceutical product line. Focus on a key business outcome.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setActivityObjectives(response.text.trim());
        } catch (error) {
            console.error("Gemini error:", error);
            alert("Failed to get AI suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    }, [ai, line, requestType]);

    const handleAddProduct = () => {
        setProducts([...products, { productId: '', units: 0, pharmacies: [] }]);
    };
    
    const handleProductChange = <T,>(productIndex: number, field: keyof RequestProduct, value: T) => {
        const newProducts = [...products];
        (newProducts[productIndex] as any)[field] = value;
        setProducts(newProducts);
    };
    
    const handleRemoveProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            alert("Please fill out the form correctly before submitting.");
            return;
        }
        
        if (!currentUser) {
            alert("User not found. Please log in again.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const newRequestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'riskScore' | 'complianceStatus'> = {
                requestDate,
                dsmId: currentUser.userId,
                dsmName: currentUser.userName,
                line: line as ProductLine,
                requestType: requestType as RequestType,
                estimatedCost: parseFloat(estimatedCost),
                activityObjectives,
                status: 'Pending',
                currentStage: 'DSM Entry',
                products,
            };
            await addRequest(newRequestData);
            alert("Request submitted successfully!");
            setCurrentView('requests');
        } catch (error) {
            console.error("Failed to submit request:", error);
            alert("An error occurred while submitting the request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Run validation on field changes
    useEffect(() => {
        validate();
    }, [requestDate, line, requestType, estimatedCost, activityObjectives, products, validate]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl card-shadow">
                <div className="px-6 py-4 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">➕ Smart Request Submission</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">AI-assisted form with intelligent suggestions and validation</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info */}
                    <Section title="📋 Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Request Date" type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} required error={errors.requestDate} />
                            <InputField label="DSM Name" type="text" value={currentUser?.userName || ''} readOnly />
                            <SelectField label="Product Line" value={line} onChange={e => setLine(e.target.value as ProductLine)} options={PRODUCT_LINES} required error={errors.line} />
                            <SelectField label="Request Type" value={requestType} onChange={e => setRequestType(e.target.value as RequestType)} options={REQUEST_TYPES} required error={errors.requestType} />
                        </div>
                    </Section>
                    
                    {/* Financial Info */}
                     <Section title="💰 Financial Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Estimated Cost (EGP)" type="number" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} required placeholder="0.00" error={errors.estimatedCost} />
                        </div>
                    </Section>

                    {/* Products */}
                    <Section title="🏥 Products & Pharmacies">
                        {products.map((p, index) => (
                             <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border dark:border-gray-600 relative">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Product {index + 1}</h4>
                                    {products.length > 1 && <button type="button" onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField 
                                        label="Select Product" 
                                        value={p.productId} 
                                        onChange={e => handleProductChange(index, 'productId', e.target.value)}
                                        options={PRODUCTS.map(pr => pr.productName)}
                                        optionValues={PRODUCTS.map(pr => pr.productId)}
                                        required
                                        error={errors[`product-${index}-productId`]}
                                    />
                                    <InputField label="Target Units" type="number" value={p.units > 0 ? p.units.toString() : ''} onChange={e => handleProductChange(index, 'units', parseInt(e.target.value) || 0)} required placeholder="0" error={errors[`product-${index}-units`]} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddProduct} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium">+ Add Another Product</button>
                    </Section>

                    {/* Activity Details */}
                    <Section title="📝 Activity Details (AI-Assisted)">
                        <TextAreaField
                            label="Activity Objectives"
                            id="activity-objectives"
                            required
                            rows={4}
                            value={activityObjectives}
                            onChange={e => setActivityObjectives(e.target.value)}
                            placeholder="Describe the objectives and expected outcomes..."
                            error={errors.activityObjectives}
                        />
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleSuggestObjectives}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait"
                                disabled={isSuggesting}
                            >
                                {isSuggesting ? ( <> <SpinnerIcon className="h-4 w-4 mr-2" /> <span>Generating...</span> </> ) : '🤖 AI Suggestion'}
                            </button>
                        </div>
                    </Section>

                    {/* Submit */}
                    <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none">
                            {isSubmitting && <SpinnerIcon className="h-5 w-5 mr-3" />}
                            {isSubmitting ? 'Submitting...' : '🚀 Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-l-4 border-blue-500 pl-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
        {children}
    </div>
);


export default NewRequestView;
