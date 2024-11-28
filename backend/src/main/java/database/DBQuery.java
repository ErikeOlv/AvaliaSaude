package database;


import java.sql.ResultSet; 
import java.sql.SQLException;
import java.sql.Statement;

public class DBQuery {
	
	private Statement statement =  null;
	private String    tableName 	= "";
	private String[]  fieldsName 	= new String[]{};
	private String    fieldKey  	= "";
	private int		  keyFieldIndex = -1;
	
	
	public DBQuery() {
		try {
			this.statement = new DBConnection().getConnection().createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	
	public String[] dontInjectionStrings(String[] values) {
		String[] tempValues = values;
		for (int i = 0; i < tempValues.length; i++) {
			
		}
		return null;
	}
	
	public DBQuery(	String tableName, String fieldsName,  String fieldKey) {
		this.setTableName	( tableName  );
		this.setFieldsName	( fieldsName );
		this.setFieldKey	( fieldKey   ); 
		try {
			this.statement = new DBConnection().getConnection().createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private int whereIsKeyField() {
		for ( int i =0; i < this.fieldsName.length; i ++ ){
			if( this.fieldsName[i].equals(this.fieldKey) ){
				return(i);
			}
		}
		return(-1);
	}
	
	public ResultSet query(String sql) { // select
		try {
			ResultSet rs = statement.executeQuery(sql);
			return (rs);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public String joinElements (String[] elements, String separator ){
		String out = "";
		for (int i=0; i< elements.length; i++) {
			out +=  elements[i].trim() +  ((i == elements.length-1) ? "" : separator );
		}
		return (out);
	}
	
	public int execute(String sql) { // insert, delete, update
		try {
			int rs = statement.executeUpdate(sql);
			return (rs);
		}catch (SQLException e) {
			System.out.println("\nErro: Verifique o comando ou a dependencia de chave extrangeira!");
		}
		
		return 0;
	}

	public ResultSet select(String where) {
		String sql = "SELECT "+  this.joinElements(this.fieldsName, ", ") + " FROM " + this.tableName;
		sql += (( where!="") ? " WHERE "+ where : "" );
		System.out.print(sql);
		return this.query(sql);
	}
	
	public int insert(String[] values) {
	    // Garantir que o número de valores seja o correto, desconsiderando o campo ID
	    if (values.length == this.fieldsName.length - 1) { // Subtraímos 1, pois o ID não será considerado
	        // Remover o campo ID da lista de campos para inserção
	        String[] fieldsWithoutId = new String[fieldsName.length - 1];
	        int index = 0;
	        for (String field : fieldsName) {
	            if (!field.equals("id")) { // Verifique o nome exato do campo ID
	                fieldsWithoutId[index++] = field;
	            }
	        }

	        // Substituir campos vazios por 'NULL'
	        for (int i = 0; i < values.length; i++) {
	            if (values[i] == null || values[i].trim().isEmpty()) {
	                values[i] = "NULL"; // Atribui 'NULL' caso o valor seja vazio
	            } else {
	                values[i] = "'" + values[i] + "'"; // Envolve o valor entre aspas caso não seja vazio
	            }
	        }

	        // Construção da consulta SQL
	        String sql = "INSERT INTO " + this.tableName + " (" + joinElements(fieldsWithoutId, ", ") + ")";
	        sql += " VALUES (" + joinElements(values, ", ") + ")";
	        
	        // Mostrar a consulta para verificação
	        System.out.println(sql);
	        return this.execute(sql); // Executa a consulta no banco
	    } else {
	        // Se o número de valores for diferente do esperado, imprime erro
	        System.out.println("O número de valores informados não é equivalente aos campos da tabela (sem o ID)!");
	    }

	    return 0; // Retorna 0 em caso de erro
	}

	
	public int delete(String[] values) {
		if (values.length != this.fieldsName.length){
			System.out.println("\n A quantidade de campos � diferente da quantidade de valores!");
			return ( 0 );
		}
		
		String sql = "\nDELETE FROM "+this.tableName+" ";
		if ( this.keyFieldIndex < 0 ){
			return(0);
		}
		sql += "\n WHERE "+ this.fieldKey +" = '"+ values[this.keyFieldIndex] +"'";
		System.out.print( sql );
		return ( this.execute(sql) );
	}
	
	public int update(String[] values) {
	    if (values.length != this.fieldsName.length) {
	        System.out.println("\n A quantidade de campos é diferente da quantidade de valores!");
	        return 0;
	    }
	    
	    String sql = "\nUPDATE " + this.tableName + " SET ";
	    boolean firstField = true;  // Para controlar se é o primeiro campo no SET
	    
	    // Variável para verificar se ao menos um campo foi atualizado
	    boolean fieldsUpdated = false;

	    for (int i = 0; i < values.length; i++) {
	        // Ignora campos que não foram alterados (ou seja, valores[i] é null ou vazio)
	        if (values[i] != null && !values[i].trim().isEmpty()) {
	            if (!firstField) {
	                sql += ", ";
	            }
	            sql += "\n\t" + this.fieldsName[i] + " = '" + values[i].trim() + "'";
	            firstField = false;
	            fieldsUpdated = true; // Marca que ao menos um campo foi atualizado
	        }
	    }

	    if (!fieldsUpdated) {
	        System.out.println("Nenhum campo foi alterado!");
	        return 0;
	    }

	    if (this.keyFieldIndex < 0) {
	        return 0;
	    }
	    
	    // Adiciona a condição WHERE no final
	    sql += "\nWHERE " + this.fieldKey + " = '" + values[this.keyFieldIndex] + "'";

	    System.out.print(sql); // Para depuração, exibe o SQL gerado
	    
	    return this.execute(sql); // Executa o SQL gerado
	}

	public String getTableName() {
		return tableName;
	}


	public void setTableName(String tableName) {
		this.tableName = tableName;
	}


	public String[] getFieldsName() {
		return fieldsName;
	}


	public void setFieldsName(String fieldsName) {
		this.fieldsName	= fieldsName.split(",");
		for (int i=0;  i< this.fieldsName.length; i++) {
			this.fieldsName[i] = this.fieldsName[i].trim();
		};
	}

	public String getFieldKey() {
		return fieldKey;
	}


	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
		this.keyFieldIndex = whereIsKeyField();

	}

	public int getKeyFieldIndex() {
		return keyFieldIndex;
	}

	public void setKeyFieldIndex(int keyFieldIndex) {
		this.keyFieldIndex = keyFieldIndex;
	}

}
