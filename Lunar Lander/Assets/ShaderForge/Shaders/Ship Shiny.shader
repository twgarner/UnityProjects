// Shader created with Shader Forge Beta 0.36 
// Shader Forge (c) Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:0.36;sub:START;pass:START;ps:flbk:,lico:1,lgpr:1,nrmq:1,limd:0,uamb:True,mssp:True,lmpd:False,lprd:False,enco:False,frtr:True,vitr:True,dbil:False,rmgx:True,rpth:0,hqsc:True,hqlp:False,tesm:0,blpr:0,bsrc:0,bdst:0,culm:0,dpts:2,wrdp:True,ufog:True,aust:True,igpj:False,qofs:0,qpre:1,rntp:1,fgom:False,fgoc:False,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,ofsf:0,ofsu:0,f2p0:False;n:type:ShaderForge.SFN_Final,id:1,x:32099,y:32684|emission-66-OUT,custl-4-OUT;n:type:ShaderForge.SFN_LightAttenuation,id:2,x:32564,y:33072;n:type:ShaderForge.SFN_LightColor,id:3,x:32678,y:32933;n:type:ShaderForge.SFN_Multiply,id:4,x:32393,y:32881|A-31-OUT,B-3-RGB,C-2-OUT;n:type:ShaderForge.SFN_LightVector,id:5,x:33344,y:32470;n:type:ShaderForge.SFN_NormalVector,id:6,x:33344,y:32606,pt:True;n:type:ShaderForge.SFN_Dot,id:7,x:33034,y:32599,dt:1|A-5-OUT,B-6-OUT;n:type:ShaderForge.SFN_Multiply,id:8,x:32776,y:32556|A-9-RGB,B-7-OUT,C-22-OUT;n:type:ShaderForge.SFN_Tex2d,id:9,x:32985,y:32428,ptlb:Diffuse,ptin:_Diffuse,tex:01af9219d152df04789264314cafd5a6,ntxv:0,isnm:False;n:type:ShaderForge.SFN_HalfVector,id:20,x:33344,y:32765;n:type:ShaderForge.SFN_Dot,id:22,x:33134,y:32737,dt:1|A-6-OUT,B-20-OUT;n:type:ShaderForge.SFN_Power,id:28,x:32900,y:32747|VAL-22-OUT,EXP-53-OUT;n:type:ShaderForge.SFN_Add,id:31,x:32585,y:32686|A-8-OUT,B-44-OUT;n:type:ShaderForge.SFN_Slider,id:37,x:33186,y:32942,ptlb:Glosiness,ptin:_Glosiness,min:1,cur:1,max:11;n:type:ShaderForge.SFN_Multiply,id:44,x:32738,y:32775|A-28-OUT,B-46-OUT;n:type:ShaderForge.SFN_Slider,id:46,x:32951,y:33115,ptlb:Specularity,ptin:_Specularity,min:0,cur:1,max:4;n:type:ShaderForge.SFN_Exp,id:53,x:33029,y:32875,et:1|IN-37-OUT;n:type:ShaderForge.SFN_AmbientLight,id:59,x:32661,y:32426;n:type:ShaderForge.SFN_Multiply,id:66,x:32458,y:32590|A-59-RGB,B-9-RGB;proporder:9-37-46;pass:END;sub:END;*/

Shader "Shader Forge/Ship Shiny" {
    Properties {
        _Diffuse ("Diffuse", 2D) = "white" {}
        _Glosiness ("Glosiness", Range(1, 11)) = 1
        _Specularity ("Specularity", Range(0, 4)) = 1
    }
    SubShader {
        Tags {
            "RenderType"="Opaque"
        }
        Pass {
            Name "ForwardBase"
            Tags {
                "LightMode"="ForwardBase"
            }
            
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #include "AutoLight.cginc"
            #pragma multi_compile_fwdbase_fullshadows
            #pragma exclude_renderers xbox360 ps3 flash d3d11_9x 
            #pragma target 3.0
            uniform float4 _LightColor0;
            uniform sampler2D _Diffuse; uniform float4 _Diffuse_ST;
            uniform float _Glosiness;
            uniform float _Specularity;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
                float3 normalDir : TEXCOORD2;
                LIGHTING_COORDS(3,4)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.texcoord0;
                o.normalDir = mul(float4(v.normal,0), _World2Object).xyz;
                o.posWorld = mul(_Object2World, v.vertex);
                o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
                TRANSFER_VERTEX_TO_FRAGMENT(o)
                return o;
            }
            fixed4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
/////// Normals:
                float3 normalDirection =  i.normalDir;
                float3 lightDirection = normalize(_WorldSpaceLightPos0.xyz);
                float3 halfDirection = normalize(viewDirection+lightDirection);
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
////// Emissive:
                float2 node_74 = i.uv0;
                float4 node_9 = tex2D(_Diffuse,TRANSFORM_TEX(node_74.rg, _Diffuse));
                float3 emissive = (UNITY_LIGHTMODEL_AMBIENT.rgb*node_9.rgb);
                float3 node_6 = normalDirection;
                float node_22 = max(0,dot(node_6,halfDirection));
                float3 finalColor = emissive + (((node_9.rgb*max(0,dot(lightDirection,node_6))*node_22)+(pow(node_22,exp2(_Glosiness))*_Specularity))*_LightColor0.rgb*attenuation);
/// Final Color:
                return fixed4(finalColor,1);
            }
            ENDCG
        }
        Pass {
            Name "ForwardAdd"
            Tags {
                "LightMode"="ForwardAdd"
            }
            Blend One One
            
            
            Fog { Color (0,0,0,0) }
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDADD
            #include "UnityCG.cginc"
            #include "AutoLight.cginc"
            #pragma multi_compile_fwdadd_fullshadows
            #pragma exclude_renderers xbox360 ps3 flash d3d11_9x 
            #pragma target 3.0
            uniform float4 _LightColor0;
            uniform sampler2D _Diffuse; uniform float4 _Diffuse_ST;
            uniform float _Glosiness;
            uniform float _Specularity;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
                float3 normalDir : TEXCOORD2;
                LIGHTING_COORDS(3,4)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.texcoord0;
                o.normalDir = mul(float4(v.normal,0), _World2Object).xyz;
                o.posWorld = mul(_Object2World, v.vertex);
                o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
                TRANSFER_VERTEX_TO_FRAGMENT(o)
                return o;
            }
            fixed4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
/////// Normals:
                float3 normalDirection =  i.normalDir;
                float3 lightDirection = normalize(lerp(_WorldSpaceLightPos0.xyz, _WorldSpaceLightPos0.xyz - i.posWorld.xyz,_WorldSpaceLightPos0.w));
                float3 halfDirection = normalize(viewDirection+lightDirection);
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
                float2 node_75 = i.uv0;
                float4 node_9 = tex2D(_Diffuse,TRANSFORM_TEX(node_75.rg, _Diffuse));
                float3 node_6 = normalDirection;
                float node_22 = max(0,dot(node_6,halfDirection));
                float3 finalColor = (((node_9.rgb*max(0,dot(lightDirection,node_6))*node_22)+(pow(node_22,exp2(_Glosiness))*_Specularity))*_LightColor0.rgb*attenuation);
/// Final Color:
                return fixed4(finalColor * 1,0);
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
    CustomEditor "ShaderForgeMaterialInspector"
}
